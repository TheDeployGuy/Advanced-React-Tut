import App, { Container } from 'next/app';
import Page from '../components/Page';

export default class MyApp extends App {
  render() {
    // This will be the component that will be rendered for the root
    const { Component } = this.props;
    
    return (
      <Container>
          <Page>
            <Component />
          </Page>
      </Container>
    )
  }
}
