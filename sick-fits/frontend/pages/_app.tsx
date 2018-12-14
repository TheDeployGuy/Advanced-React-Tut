import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

interface PageProps{
  query: string;
}
class MyApp extends App {

  // This will run before the render
  static async getInitialProps({Component, ctx}) {
    let pageProps: PageProps = {
      query: ''
    };
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // this exposes the query to the user.
    pageProps.query = ctx.query;
    // When you return something like this in next.js it exposes them values as props
    return { pageProps }

  }
  render() {
    // Component: This will be the component that will be rendered for the root
    // Apollo will be the apollo client exposed to use via withData.
    const { Component, apollo, pageProps } = this.props;
    
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp)
