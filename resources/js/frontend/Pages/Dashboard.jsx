import React, { useState, useCallback, useEffect, useContext } from "react";
import { number } from "prop-types";
import {
  Page,
  Card,
  Tabs,
  Link,
  TextField,
  IndexTable,
  Loading,
  Icon,
  Text,
  Avatar,
  Pagination,
  Badge,
  EmptySearchResult,
  Toast,
  Tooltip,
  Button,
  Popover,
  ActionList,
  ButtonGroup,
  useIndexResourceState,
  Modal,
  Layout,
  LegacyCard,
  ResourceList,
  Thumbnail,
} from "@shopify/polaris";
import {
  SearchMinor,
  ExternalMinor,
  DeleteMinor,
  HorizontalDotsMinor,
} from "@shopify/polaris-icons";
import { AppContext } from "../components/providers/ContextProvider";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { CustomBadge } from "../components/Utils/CustomBadge";
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/Utils";
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from "recharts";
import { DateRangePicker } from "rsuite";
import {getAccessToken} from "../assets/cookies";




const resourceName = {
  singular: "order",
  plural: "orders",
};

export function Dashboard() {
  const { apiUrl } = useContext(AppContext);
  // const { user } = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [active, setActive] = useState(false);

    const [orders, setOrders] = useState([])
    const [sellers, setSellers] = useState([])

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  //modal code
  const [modalReassign, setModalReassign] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [uniqueId, setUniqueId] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [sellerMessage, setSellerMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const handleSelect = async (ranges) => {
    // console.log(ranges);
    let formattedDate = [];
    ranges?.map((range) => {
      const date = new Date(range);
      formattedDate.push(date.toISOString().slice(0, 10));
      // console.log(formattedDate);
    });
    setDateRange(formattedDate);
  };

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );


  const tabs = [
    {
      id: "all-customers-1",
      content: "Over All",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-1",
    },
    {
      id: "accepts-marketing-1",
      content: "This Week",
      panelID: "accepts-marketing-content-1",
    },
    {
      id: "repeat-customers-1",
      content: "This Month",
      panelID: "repeat-customers-content-1",
    },
    {
      id: "prospects-1",
      content: "This Year",
      panelID: "prospects-content-1",
    },
  ];

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

  const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Aug", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Sep", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Oct", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Nov", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Dec", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(sellers);


    const formatDate=(created_at)=>{
        const date = new Date(created_at);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formatedDate = `${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}-${year}`;
        return formatedDate;
    }

    const rowMarkup = sellers.map(
    ({ id, seller_id, name, seller_shopname, email, created_at, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={() => handleRowClick(id)} // Add this line
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {id != null ? id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{name != null ? name : "---"}</IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          {seller_shopname != null ? seller_shopname : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>{email != null ? email : "---"}</IndexTable.Cell>

          <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>
          <IndexTable.Cell>
              <CustomBadge value={status==1 ?"ACTIVE" : "Disabled"} type="products" />

          </IndexTable.Cell>

      </IndexTable.Row>
    )
  );

  const rowMarkup2 = orders.map(
    (
      {
        id,
        order_id,
        order_number,
          user_name,
          gateway,
          financial_status,
          fulfillment_status,
        tracking_id,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {id != null ? id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {order_number != null ? order_number : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          {user_name != null ? user_name : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>
          {gateway != null ? gateway : "---"}
        </IndexTable.Cell>

          <IndexTable.Cell>
              <CustomBadge value={financial_status=="paid" ? 'PAID' : financial_status} type="orders" variant={"financial"} />
          </IndexTable.Cell>


          <IndexTable.Cell>
              <CustomBadge value={fulfillment_status=='' ? 'UNFULFILLED' : fulfillment_status} type="orders" variant={"fulfillment"} />
          </IndexTable.Cell>

          <IndexTable.Cell>
              {tracking_id != null ? tracking_id : "N/A"}
          </IndexTable.Cell>
      </IndexTable.Row>
    )
  );


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/recent-orders`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setOrders(response?.data)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getSellerData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/recent-sellers`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setSellers(response?.data)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
        getSellerData();
    }, []);


    return (
    <div className="Products-Page IndexTable-Page Orders-page">
      {!loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
        <Page fullWidth title="Dashboard">
          <Layout>
            <Layout.Section oneThird>
              <LegacyCard title="Sales">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can see graph of your sales.
                  </Text>
                </LegacyCard.Section>
                <LegacyCard.Section>
                  <AreaChart width={300} height={200} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Store Statistics">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can check Statistics of your Marketplace Store.
                  </Text>
                </LegacyCard.Section>
                <LegacyCard>
                  <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                  >
                    <LegacyCard.Section title={tabs[selected].content}>
                      <p>Products {selected} selected</p>
                    </LegacyCard.Section>
                    <LegacyCard.Section>
                      <div className="margin-top"></div>{" "}
                      <Text>
                        Products that are currently Activated on your
                        Marketplace Store.
                      </Text>
                    </LegacyCard.Section>
                  </Tabs>
                </LegacyCard>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Store Earning">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can check your earning
                  </Text>
                </LegacyCard.Section>
                <LegacyCard.Section>
                  <DateRangePicker
                    onChange={handleSelect}
                    ranges={[dateRange]}
                    placeholder="Select Date Range"
                    showOneCalendar
                  />
                </LegacyCard.Section>
                <LegacyCard.Section>
                  <Text>Total earning: 43</Text>
                  <div className="margin-top"> </div>
                  <Text>
                    This is the Overall Earning Amount of your Marketplace
                    Store.
                  </Text>
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section>
          </Layout>

          <div style={{ marginTop: "30px" }}></div>
          <LegacyCard title="Recent Orders">
            <LegacyCard.Section>
              <IndexTable
                resourceName={resourceName}
                itemCount={orders.length}
                selectable={false}
                headings={[
                  { title: "Order Id" },
                  { title: "Store Order Id" },
                  { title: "Seller" },
                  { title: "Payment Mode" },
                  { title: "Payment Status" },
                  { title: "Order Status" },
                  { title: "Tracking Id" },
                ]}
              >
                {rowMarkup2}
              </IndexTable>

              {/* <Text color="subdued" as="span">
                Here you can check all recent Orders of your Marketplace Store.
              </Text>
              <div className="margin-top"></div>
              <Text color="subdued" as="span">
                Recent orders will appear here.{" "}
              </Text>

              <div className="margin-top"></div>
              <Button primary>VIEW ALL ORDERS</Button>
              <div className="margin-top"></div>
              <Text color="subdued" as="span">
                Click on the Button above to View all the Details for all
                Orders.
              </Text> */}
            </LegacyCard.Section>
          </LegacyCard>
          <div style={{ marginTop: "30px" }}></div>

          <LegacyCard title="Recent Seller">
            <LegacyCard.Section>
              <IndexTable
                resourceName={resourceName}
                selectable={false}
                itemCount={sellers.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Seller ID" },
                  { title: "Seller Name" },
                  { title: "Store Name" },
                  { title: "Email" },
                  { title: "Date" },
                  { title: "Status" },
                ]}
              >
                {rowMarkup}
              </IndexTable>
              {/* <Text color="subdued" as="span">
                Here you can check all recent Orders of your Marketplace Store.
              </Text>
              <div className="margin-top"></div>
              <Text color="subdued" as="span">
                Recent orders will appear here.{" "}
              </Text>

              <div className="margin-top"></div>
              <Button primary>VIEW ALL ORDERS</Button>
              <div className="margin-top"></div>
              <Text color="subdued" as="span">
                Click on the Button above to View all the Details for all
                Orders.
              </Text> */}
            </LegacyCard.Section>
          </LegacyCard>
          <div style={{ marginTop: "30px" }}></div>
          <Layout>
            <Layout.Section oneHalf>
              <LegacyCard title="Top Sold Products">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can check your top sold products
                  </Text>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Top sold products will appear here
                  </Text>

                  <div className="margin-top"></div>
                  <Button fullWidth primary>
                    VIEW ALL PRODUCT
                  </Button>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Click on the Button above to View all the Details for all
                    Products.
                  </Text>
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section>
            {/* <Layout.Section oneHalf>
              <LegacyCard title="Recent Orders">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can check all recent Orders of your Marketplace
                    Store.
                  </Text>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Recent orders will appear here.{" "}
                  </Text>

                  <div className="margin-top"></div>
                  <Button fullWidth primary>
                    VIEW ALL ORDERS
                  </Button>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Click on the Button above to View all the Details for all
                    Orders.
                  </Text>
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section> */}
            <Layout.Section oneHalf>
              <LegacyCard title="Out of Stock Products">
                <LegacyCard.Section>
                  <Text color="subdued" as="span">
                    Here you can see Products which are out of stock .
                  </Text>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Out of stock products will appear here.
                  </Text>

                  <div className="margin-top"></div>
                  <Button fullWidth primary>
                    VIEW ALL PRODUCT
                  </Button>
                  <div className="margin-top"></div>
                  <Text color="subdued" as="span">
                    Click on the Button above to View all the Details for all
                    Products.
                  </Text>
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section>
          </Layout>

          {/* <Card>
            <div className="Polaris-Table">
              <Card sectioned title="SALES">
                <Text variant="bodyMd" as="p" fontWeight="regular">
                  {`Here you can check all recent Orders of your Marketplace Store. `}
                </Text>
                <br />
                <AreaChart width={1000} height={500} data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </Card>
            </div>
          </Card> */}
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
