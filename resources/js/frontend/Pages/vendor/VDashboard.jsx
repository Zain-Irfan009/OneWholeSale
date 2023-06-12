import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip, Button, Popover, ActionList, ButtonGroup, useIndexResourceState, Modal
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import { CustomBadge } from '../../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../../components/Utils/InputField";
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';


export function VDashboard() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [customersLoading, setCustomersLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [storeUrl, setStoreUrl] = useState('')
    const [active, setActive] = useState(false);


    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')

    //modal code
    const [modalReassign, setModalReassign] = useState(false)
    const [modalChangePassword, setModalChangePassword] = useState(false)
    const [uniqueId, setUniqueId] = useState()
    const [btnLoading, setBtnLoading] = useState(false)
    const [sellerMessage, setSellerMessage] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')




    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const data = [
        { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Aug', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Sep', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Oct', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Nov', uv: 3490, pv: 4300, amt: 2100 },
        { name: 'Dec', uv: 3490, pv: 4300, amt: 2100 },
    ];


    return (
        <div className='Products-Page IndexTable-Page Orders-page'>

            {!loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="Dashboard"

                >

                    <Card>
                        <div className='Polaris-Table'>
                            <Card sectioned title='SALES'>

                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                    {`Here you can check all recent Orders of your Marketplace Store. `}
                                </Text>
                                <br/>
                                <AreaChart width={1000} height={500} data={data}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>

                            </Card>

                        </div>

                    </Card>

                </Page>

            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

