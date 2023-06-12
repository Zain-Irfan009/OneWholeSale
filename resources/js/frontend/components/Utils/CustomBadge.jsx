import React from 'react'
import { Badge } from '@shopify/polaris';

export function CustomBadge({ value, type, variant }) {
    return (
        // <>
        //     {type === 'discount' ?
        // (() => {
        //     switch (value) {
        //         case "active":
        //             return (
        //                 <Badge status='success'>Active</Badge>
        //             )

        //         case 'scheduled':
        //             return (
        //                 <Badge status='attention'>Scheduled</Badge>
        //             )

        //         case 'expired':
        //             return (
        //                 <Badge>Expired</Badge>
        //             )

        //         default:
        //             return (
        //                 <Badge>{value}</Badge>
        //             )
        //     }

        // })()
        //         :

        //         (() => {
        //             switch (value) {
        //                 case 'confirmed':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 case 'delivered':
        //                     return (
        //                         <Badge status='success'>{value}</Badge>
        //                     )

        //                 case 'expired':
        //                     return (
        //                         <Badge status='warning'>{value}</Badge>
        //                     )

        //                 case 'notfound':
        //                     return (
        //                         <Badge status='critical'>{value}</Badge>
        //                     )

        //                 case 'in_transit':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 case 'InfoReceived':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 case 'pending':
        //                     return (
        //                         <Badge status='attention'>{value}</Badge>
        //                     )

        //                 case 'out_for_delivery':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 case 'pickup':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 case 'attempted_delivery':
        //                     return (
        //                         <Badge status='info'>{value}</Badge>
        //                     )

        //                 default:
        //                     return (
        //                         <Badge>{value}</Badge>
        //                     )
        //             }

        //         })()
        //     }
        // </>

        <>
            {(() => {
                switch (type) {
                    case 'discount':
                        return (
                            (() => {
                                switch (value) {
                                    case "ACTIVE":
                                        return (
                                            <Badge status='success'>Active</Badge>
                                        )

                                    case 'SCHEDULED':
                                        return (
                                            <Badge status='attention'>Scheduled</Badge>
                                        )

                                    case 'EXPIRED':
                                        return (
                                            <Badge>Expired</Badge>
                                        )

                                    default:
                                        return (
                                            <Badge>{value}</Badge>
                                        )
                                }

                            })()
                        )

                    case 'products':
                        return (
                            (() => {
                                switch (value) {
                                    case "ACTIVE":
                                        return (
                                            <Badge status='success'>Active</Badge>
                                        )

                                    case 'DRAFT':
                                        return (
                                            <Badge status='info'>Draft</Badge>
                                        )

                                    case 'APPROVED':
                                        return (
                                            <Badge status='success'>Approved</Badge>
                                        )

                                    case 'NORMAL':
                                        return (
                                            <Badge status='info'>Normal</Badge>
                                        )




                                    default:
                                        return (
                                            <Badge>{value}</Badge>
                                        )
                                }

                            })()
                        )

                    case 'orders':
                        return (
                            (() => {
                                switch (variant) {
                                    case 'financial':
                                        return (
                                            (() => {
                                                switch (value) {
                                                    case "PAID":
                                                        return (
                                                            <Badge progress='complete'>Paid</Badge>
                                                        )

                                                    case "REFUNDED":
                                                        return (
                                                            <Badge progress='complete'>Refunded</Badge>
                                                        )

                                                    case "PENDING":
                                                        return (
                                                            <Badge status='warning' progress="partiallyComplete">Pending</Badge>
                                                        )

                                                    case "PARTIALLY_PAID":
                                                        return (
                                                            <Badge status='attention' progress="partiallyComplete">Partially Paid</Badge>
                                                        )

                                                    default:
                                                        return (
                                                            <Badge>{value}</Badge>
                                                        )
                                                }

                                            })()
                                        )

                                    case 'fulfillment':
                                        return (
                                            (() => {
                                                switch (value) {
                                                    case null:
                                                        return (
                                                            <Badge progress="incomplete" status="attention">Unfulfilled</Badge>
                                                        )

                                                    case "UNFULFILLED":
                                                        return (
                                                            <Badge progress="incomplete" status="attention">Unfulfilled</Badge>
                                                        )

                                                    case "FULFILLED":
                                                        return (
                                                            <Badge progress='complete'>Fulfilled</Badge>
                                                        )

                                                    case "PARTIAL":
                                                        return (
                                                            <Badge progress="partiallyComplete" status="warning">Partially fulfilled</Badge>
                                                        )

                                                    case "IN_PROGRESS":
                                                        return (
                                                            <Badge progress="partiallyComplete" status="info">In Progress</Badge>
                                                        )

                                                    default:
                                                        return (
                                                            <Badge>{value}</Badge>
                                                        )
                                                }

                                            })()
                                        )
                                }

                            })()
                        )


                    default:
                        break
                }

            })()}
        </>
    );
}
