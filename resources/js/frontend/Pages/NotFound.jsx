import React from 'react'
import { Card, Page, Button, EmptyState } from '@shopify/polaris';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <Page>
      <Card sectioned>
        <EmptyState
          heading="There’s no page at this address"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/bf64694af97df25c00f566ae91ae155319c09b7ef091e670855127f65163e5e9.svg"
          fullWidth
        >
          <p>Check the URL and try again, or use the search bar to find what you need.</p>
          <br />
          <Link to='/'>
            <Button>goto home page</Button>
          </Link>
        </EmptyState>
      </Card>
    </Page>
  )
}
