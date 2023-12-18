import React from 'react';
import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
} from '@shopify/polaris';

export function Test() {
    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
            paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
    ];
    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(orders);

    const rowMarkup = orders.map(
        (
            {id, order, date, customer, total, paymentStatus, fulfillmentStatus},
            index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {order}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{date}</IndexTable.Cell>
                <IndexTable.Cell>{customer}</IndexTable.Cell>
                <IndexTable.Cell>{total}</IndexTable.Cell>
                <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
                <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const promotedBulkActions = [
        {
            content: 'Create shipping labels',
            onAction: () => console.log('Todo: implement create shipping labels'),
        },



    ];
    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },

    ];
    return (
        <div className="brand-table">
            <IndexTable
                resourceName={resourceName}
                itemCount={orders.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                hasMoreItems
                bulkActions={bulkActions}
                promotedBulkActions={promotedBulkActions}

                headings={[
                    { title: 'Title' },
                    { title: 'Type' },
                    { title: 'Product Count' },


                    { title: 'Action', alignment: 'end' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </div>
    );



}
