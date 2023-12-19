import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    useMemo, useRef,
} from "react";
import {
    Page,
    Layout,
    Card,
    Modal,
    Text,
    Stack,
    ButtonGroup,
    Button,
    PageActions,
    Form,
    FormLayout,
    Toast,
    List,
    TextContainer,
    Banner,
    Loading,
    Scrollable,
    Avatar,
    EmptyState,
    TextField,
    Listbox,
    Divider,
    ContextualSaveBar,
    EmptySearchResult,
    AutoSelection,
    Tabs,
    Icon,
    Select,
    Tag,
    Autocomplete,
    LegacyStack,
    Checkbox,
    DropZone,
    Thumbnail,
    Combobox, Link, IndexTable,
} from "@shopify/polaris";
import {
    SearchMinor,
    ChevronDownMinor,
    ChevronUpMinor,
    DeleteMinor, MobilePlusMajor, NoteMinor,
} from "@shopify/polaris-icons";
import { SkeltonPageForTable } from "../../components/global/SkeltonPage";
import { InputField } from "../../components/Utils/InputField";
import { CheckBox } from "../../components/Utils/CheckBox";
import { AppContext } from "../../components/providers/ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EmptyCheckBox from "../../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../../assets/cookies";
import Fileimg from "../../assets/file.jpg";

    export function EditShipment() {
        const {apiUrl} = useContext(AppContext);
        // const { user } = useAuthState();
        const navigate = useNavigate();
        const params = useParams();

        const [skeleton, setSkeleton] = useState(false)
        const [btnLoading, setBtnLoading] = useState(false);
        const [loading, setLoading] = useState(false);

        const [errorToast, setErrorToast] = useState(false);
        const [sucessToast, setSucessToast] = useState(false);
        const [toastMsg, setToastMsg] = useState("");
        const [trackingNumber, setTrackingNumber] = useState("");
        const [discardModal, setDiscardModal] = useState(false);
        const [courierInputValue, setCourierInputValue] = useState("");
        const [courierList, setCourierList] = useState(
            []
        );

        const [mediaFiles, setImageFiles] = useState([]);
        const [rejectedFiles, setRejectedFiles] = useState([]);
        const [comment, setComment] = useState("");
        const [orignalCourierList, setOrignalCourierList] = useState(
            []
        );
        const [openFileDialog, setOpenFileDialog] = useState(false);
        const [pendingTrackingNumber, setPendingTrackingNumber] = useState("");
        const [newTrackingNumber, setNewTrackingNumber] = useState([]);

        const addNewTrackingNumber = (trackingNumber) => {
            const trackingNumberSet = new Set(newTrackingNumber);
            const newTrackingNumberArray = [...trackingNumberSet.add(trackingNumber)];
            setNewTrackingNumber(newTrackingNumberArray);
            setPendingTrackingNumber("");
        };

        const [file5, setFile5] = useState();
        const [fileUrl5, setFileUrl5] = useState();

        const handleKeyPress = (event) => {
            const enterKeyPressed = event.keyCode === 13;
            if (enterKeyPressed) {
                event.preventDefault();
                addNewTrackingNumber(pendingTrackingNumber);
            }
        };

        const handleChange = (value) => {
            const trimmedValue = value.trim();

            if (trimmedValue !== "") {
                const lastChar = value.charAt(value.length - 1);

                if (lastChar === "," || lastChar === " ") {
                    return addNewTrackingNumber(value.slice(0, -1));
                }

                setPendingTrackingNumber(value);
            }

        };

        const handleBannerRemove = (type) => {
            if (type == "favicons") {
                setFile5();
            }
        };
        const removeTrackingNumber = useCallback(
            (tag) => () => {
                setNewTrackingNumber((previousTags) =>
                    previousTags.filter((previousTag) => previousTag !== tag)
                );
            },
            []
        );

        let trackingNumberToAddMarkup = null;

        if (newTrackingNumber.length > 0) {
            const tagsToAdd = newTrackingNumber.map((tag) => (
                <Tag key={tag} onRemove={removeTrackingNumber(tag)}>
                    {tag}
                </Tag>
            ));
            trackingNumberToAddMarkup = <Stack>{tagsToAdd}</Stack>;
        }


        const [optionsLoading, setOptionsLoading] = useState(false);
        const [courierListSelected, setCourierListSelected] =
            useState("");

        const [formErrors, setFormErrors] = useState({});

        const courierUpdateText = useCallback(
            (value) => {


                setCourierInputValue(value);

                if (!optionsLoading) {
                    setOptionsLoading(true);
                }

                setTimeout(() => {
                    if (value === "") {
                        console.log(courierList)
                        setCourierList(orignalCourierList);
                        setOptionsLoading(false);
                        return;
                    }

                    const filterRegex = new RegExp(value, "i");
                    const resultOptions = courierList.filter((option) =>
                        option.label.match(filterRegex)
                    );
                    let endIndex = resultOptions.length - 1;
                    if (resultOptions.length === 0) {
                        endIndex = 0;
                    }

                    console.log('resultOptions', resultOptions)
                    setCourierList(resultOptions);
                    setOptionsLoading(false);
                }, 300);
            },
            [courierList, optionsLoading, courierListSelected]
        );

        function tagTitleCase(string) {
            return string
                .toLowerCase()
                .split(" ")
                .map((word) => word.replace(word[0], word[0].toUpperCase()))
                .join("");
        }


        const removeCourier = useCallback(
            (collection) => () => {

                const collectionOptions = [...courierListSelected];
                collectionOptions.splice(collectionOptions.indexOf(collection), 1);
                setCourierListSelected(collectionOptions);
            },

            []
        );

        const getShipmentData = async (id) => {

            setSkeleton(true);

            const sessionToken = getAccessToken();
            try {
                const response = await axios.get(`${apiUrl}/seller/shipment-view/${id}`, {
                    headers: {
                        Authorization: "Bearer " + sessionToken,
                    },
                });
                console.log("getShipmentData response", response.data);

                setFileUrl5(response?.data?.shipment?.file)

                setCourierListSelected(
                    response?.data?.shipment?.courier_name ? [response.data.shipment.courier_name] : []
                );
                if (response?.data?.shipment?.tracking_number !== '') {
                    setNewTrackingNumber(response?.data?.shipment?.tracking_number?.split(","));
                }
                setComment(response?.data?.shipment?.comment)

                // setSellerEmail(response?.data?.shipment?.courier_name);





                setSkeleton(false);
                setLoading(false)
            } catch (error) {
                console.log(error)
                setToastMsg(error?.response?.data?.message);
                setErrorToast(true);
                setSkeleton(false);
            }
        };



        useEffect(() => {
            getShipmentData(params.shipment_id);
        }, []);

        const [selectedFile, setSelectedFile] = useState(null);

        const handleDropZoneDrop = useCallback(
            (_dropFiles, acceptedFiles, _rejectedFiles) => {
                setSelectedFile(acceptedFiles[0]);
                setImageFiles((files) => [...files, ...acceptedFiles]);
            },
            []
        );
        const validImageTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];


        const uploadedFiles = mediaFiles.length > 0 && (
            <Stack vertical>
                {mediaFiles.map((file, index) => (
                    <Stack alignment="center" key={index}>
                        <Thumbnail
                            size="small"
                            alt={file.name}
                            source={
                                validImageTypes.includes(file.type)
                                    ? NoteMinor
                                    : window.URL.createObjectURL(file)
                            }
                        />
                        <div>
                            {file.name}{' '}
                            <Text variant="bodySm" as="p">
                                {file.size} bytes
                            </Text>
                        </div>
                    </Stack>
                ))}
            </Stack>
        );

        const courierContentMarkup =
            courierListSelected.length > 0 ? (
                <div className="Product-Tags-Stack">
                    <Stack spacing="extraTight" alignment="center">
                        {courierListSelected.map((option) => {
                            let tagLabel = "";
                            tagLabel = option.replace("_", " ");
                            tagLabel = tagTitleCase(tagLabel);
                            return (
                                <Tag
                                    key={`option${option}`}
                                    onRemove={removeCourier(option)}
                                >
                                    {tagLabel}
                                </Tag>
                            );
                        })}
                    </Stack>
                </div>
            ) : null;

        const courierTextField = (
            <Autocomplete.TextField
                onChange={courierUpdateText}
                label="Couriers"
                value={courierInputValue}
                placeholder="Select Courier"
                verticalContent={courierContentMarkup}
            />
        );

        const [visible, setVisible] = useState(false);

        function nodeContainsDescendant(rootNode, descendant) {
            if (rootNode === descendant) {
                return true;
            }
            let parent = descendant.parentNode;
            while (parent != null) {
                if (parent === rootNode) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        }

        const datePickerRef = useRef(null);
        function isNodeWithinPopover(node) {
            return datePickerRef?.current
                ? nodeContainsDescendant(datePickerRef.current, node)
                : false;
        }


        const [selectedDate, setSelectedDate] = useState(new Date());
        const [{ month, year }, setDate] = useState({
            month: selectedDate.getMonth(),
            year: selectedDate.getFullYear(),
        });
        function handleMonthChange(month, year) {
            setDate({ month, year });
        }

        const formattedValue = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

// ...

        function handleDateSelection({ end: newSelectedDate }) {
            console.log(newSelectedDate, 'newSelectedDate');
            setSelectedDate(newSelectedDate);
            setVisible(false);
        }


        const [showSaveBar, setShowSaveBar] = useState(false);


        function handleOnClose({ relatedTarget }) {
            setVisible(false);
        }


        useEffect(() => {
            if (selectedDate) {
                setDate({
                    month: selectedDate.getMonth(),
                    year: selectedDate.getFullYear(),
                });

                console.log('check',selectedDate)
            }
        }, [selectedDate]);




        const handleDiscardModal = () => {
            setDiscardModal(!discardModal);
        };

        function handleInputValueChange() {
            console.log("handleInputValueChange");
        }

        const discardAddSeller = () => {
            navigate("/shipments");
        };

        function handleStoreDescription(event, editor) {
            const data = editor.getData();
            console.log(data);
            setStoreDescriptionContent(data);
        }



        const [tax, setTax] = useState(0);

        const handleTaxPayingStatusChange = (selectedOption) => {
            if(selectedOption=="Yes"){
                setShowTaxField(true)
            }else{
                setShowTaxField(false)
            }
            SetTaxPayingSeller(selectedOption);
        };

        // =================Products Modal Code Ends Here================





        // ------------------------Toasts Code start here------------------
        const toggleErrorMsgActive = useCallback(
            () => setErrorToast((errorToast) => !errorToast),
            []
        );
        const toggleSuccessMsgActive = useCallback(
            () => setSucessToast((sucessToast) => !sucessToast),
            []
        );

        const toastErrorMsg = errorToast ? (
            <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
        ) : null;

        const toastSuccessMsg = sucessToast ? (
            <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
        ) : null;



        //SUbmit Data
        const submitData = async () => {


            const sessionToken = getAccessToken();

            const errors = {};

            // if (courierInputValue.trim() === '') {
            //     errors.courierInputValue = 'Courier is required';
            // }


            // if (Object.keys(errors).length > 0) {
            //     setFormErrors(errors);
            //     setBtnLoading(false)
            //     return;
            // }
            setBtnLoading(true)
            setLoading(true)
            let formData = new FormData();
            formData.append('courier',courierListSelected);
            formData.append('comment',comment);
            formData.append('tracking_number',newTrackingNumber);
            formData.append('file_selected',selectedFile);
            formData.append('file_url',fileUrl5);
            formData.append('id',params.shipment_id);

            try {
                const response = await axios.post(`${apiUrl}/seller/edit-shipment`,formData,
                    {
                        headers: {
                            Authorization: "Bearer " + sessionToken
                        }
                    })

                setBtnLoading(false)
                setLoading(false)
                navigate(`/shipments`, { state: { customText: response?.data?.message } });
                setToastMsg(response?.data?.message)
                setSucessToast(true)
                setSkeleton(false)


            } catch (error) {
                setBtnLoading(false)
                setLoading(false)
                setToastMsg(error?.response?.data?.message)
                setErrorToast(true)
                setSkeleton(false)
            }
        }


        const getCourierData = async () => {

            const sessionToken = getAccessToken();
            try {

                const response = await axios.get(`${apiUrl}/seller/couriers`,
                    {
                        headers: {
                            Authorization: "Bearer " + sessionToken
                        }
                    })

                console.log('response',response?.data)
                const arr = response?.data?.data.map(couriers => ({ value: couriers, label: couriers }));

                setCourierList(arr)
                setOrignalCourierList(arr)


            } catch (error) {
                console.log(error)
                setToastMsg(error?.response?.data?.message)
                setErrorToast(true)
            }
        }

        useEffect(() => {
            getCourierData();

        }, []);

        const fileUpload = !mediaFiles.length && (
            <DropZone.FileUpload actionHint="Accepts .csv, .xlsx only" />
        );









        return (
            <div className="Discount-Detail-Page">
                <Modal
                    open={discardModal}
                    onClose={handleDiscardModal}
                    title="Leave page with unsaved changes?"
                    primaryAction={{
                        content: "Leave page",
                        destructive: true,
                        onAction: discardAddSeller,
                    }}
                    secondaryActions={[
                        {
                            content: "Stay",
                            onAction: handleDiscardModal,
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>Leaving this page will delete all unsaved changes.</p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>

                {loading ? (
                    <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
                ) : (
                    <Page
                        breadcrumbs={[{ content: "Discounts", onAction: handleDiscardModal }]}
                        title="Edit Shipment"
                        fullWidth

                    >
                        {showSaveBar && (
                            <ContextualSaveBar
                                message="Unsaved changes"
                                saveAction={{
                                    onAction: () => console.log("add form submit logic"),
                                    loading: false,
                                    disabled: false,
                                }}
                                discardAction={{
                                    onAction: () => console.log("add clear form logic"),
                                }}
                            />
                        )}


                        <Form>
                            <FormLayout>
                                <Card sectioned title="">



                                    {/*<div>*/}
                                    {/*    <Stack inlineAlign="center" gap="400">*/}
                                    {/*    <Box minWidth="276px" padding={{ xs: 200 }}>*/}
                                    {/*    <Popover*/}
                                    {/*        active={visible}*/}
                                    {/*        autofocusTarget="none"*/}
                                    {/*        preferredAlignment="left"*/}
                                    {/*        fullWidth*/}
                                    {/*        preferInputActivator={false}*/}
                                    {/*        preferredPosition="below"*/}
                                    {/*        preventCloseOnChildOverlayClick*/}
                                    {/*        onClose={handleOnClose}*/}
                                    {/*        activator={*/}
                                    {/*            <TextField*/}
                                    {/*                role="combobox"*/}
                                    {/*                label={"Shipment date"}*/}
                                    {/*                prefix={<Icon source={CalendarMinor} />}*/}
                                    {/*                value={formattedValue}*/}
                                    {/*                onFocus={() => setVisible(true)}*/}
                                    {/*                onChange={handleInputValueChange}*/}
                                    {/*                autoComplete="off"*/}
                                    {/*            />*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        <Card ref={datePickerRef}>*/}
                                    {/*            <DatePicker*/}
                                    {/*                month={month}*/}
                                    {/*                year={year}*/}
                                    {/*                selected={selectedDate}*/}
                                    {/*                onMonthChange={handleMonthChange}*/}
                                    {/*                onChange={handleDateSelection}*/}
                                    {/*            />*/}
                                    {/*        </Card>*/}
                                    {/*    </Popover>*/}
                                    {/*    </Box>*/}
                                    {/*    </Stack>*/}
                                    {/*</div>*/}
                                    <div className="label_editor">

                                        <Autocomplete

                                            options={courierList}
                                            selected={courierListSelected}
                                            textField={courierTextField}
                                            loading={optionsLoading}
                                            onSelect={
                                                setCourierListSelected
                                            }
                                            listTitle="Couriers"
                                        />

                                    </div>
                                    <div className="margin-top" />
                                    <div onKeyDown={handleKeyPress}>
                                        <TextField
                                            id="pendingTag"
                                            label="Tracking Number"
                                            value={pendingTrackingNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="tags_spacing">{trackingNumberToAddMarkup}</div>

                                    <div className="margin-top" />
                                    <div>
                                        {
                                            fileUrl5 && fileUrl5 !== 'null'  &&
                                            <a href={fileUrl5} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                                    src={Fileimg}
                                                    alt="File Image"
                                                />
                                            </a>
                                        }

                                        <DropZone onDrop={handleDropZoneDrop} variableHeight label="Upload File">
                                            {uploadedFiles}
                                            {fileUpload}
                                        </DropZone>
                                    </div>
                                    <div className="margin-top" />
                                    <InputField
                                        multiline={3}
                                        label="Comment"
                                        placeholder="Enter Comment Here"
                                        type="text"
                                        marginTop
                                        name="title"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        // error={formErrors.storeAddress}
                                    />

                                </Card>

                            </FormLayout>
                        </Form>

                        <div className="Polaris-Product-Actions">
                            <PageActions
                                primaryAction={{
                                    content: "Submit",
                                    onAction: submitData,
                                    loading: btnLoading,
                                }}
                            />
                        </div>
                    </Page>
                )}
                {toastErrorMsg}
                {toastSuccessMsg}
            </div>
        );
    }


