import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";
import Link from "next/link";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;
const Pagination: React.SFC<{
  page: number;
}> = props => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const currentPage = props.page;
        return (
          <PaginationStyles>
            <Head>
              <title>
                Sicks Fits - Page {currentPage} of {pages}
              </title>
            </Head>
            <Link
              prefetch
              href={{
                pathname: "items",
                query: { page: currentPage - 1 }
              }}
            >
              <a className="prev" aria-disabled={currentPage <= 1}>
                Prev
              </a>
            </Link>
            <p>
              Page {currentPage} of {pages}
            </p>
            <Link
              prefetch
              href={{
                pathname: "items",
                query: { page: currentPage + 1 }
              }}
            >
              <a className="next" aria-disabled={currentPage >= pages}>
                Next
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};
export default Pagination;
