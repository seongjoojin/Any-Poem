import Document, { Head, Main, NextScript, NextDocumentContext } from "next/document"
import { createGlobalStyle, ServerStyleSheet } from "styled-components"

export default class MyDocument extends Document<IProps> {
	static getInitialProps({ renderPage, req }: NextDocumentContext) {
		const sheet = new ServerStyleSheet()
		const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))
		const styleTags = sheet.getStyleElement()
		return { ...page, styleTags }
	}

	render() {
		return (
			<html>
				<Head>
					<meta name="author" content={"type-any"} />
					<link rel="shortcut icon" href="static/favicon.ico" />
					{this.props.styleTags}
				</Head>
				<body>
					<GlobalStyle />
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}

interface IProps {
	styleTags: []
}

const GlobalStyle = createGlobalStyle`
  html, body { 
    width: 100%; 
    margin: 0; 
  }  

  body { 
    font-size: 11px;
    width: 100%; 
    background: #ffffff; 
    font-family: sans-serif;
    color: #444444;
    display: flex;
    justify-content: center;
  }

  #__next {
    width: 100%;
  }
`
