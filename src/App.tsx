import { Card, Col, Flex, Layout, Pagination, Row, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import productService from "./service/product.service";
import { getErrorMessage } from "./utils/getErrorMessage";
const { Header, Footer, Content } = Layout;
type Product = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "20px",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  minHeight: "100vh",
};

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  // const fetchProducts = () => {
  //   setIsLoading(true);

  //   fetch("https://dummyjson.com/products")
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.products))
  //     .catch((err) => console.log(err))
  //     .finally(() => setIsLoading(false));
  // };

  // const fetchProducts = () => {
  //   setIsLoading(true);

  //   axios
  //     .get("https://dummyjson.com/products")
  //     .then((res) => setProducts(res.data.products))
  //     .catch((error: unknown) => {
  //       let errorMessage = "Error fetching products";
  //       console.error(errorMessage);

  //       if (axios.isAxiosError(error)) {
  //         const axiosError = error;

  //         if (axiosError.response) {
  //           errorMessage = `Server error: ${axiosError.response.status} - ${axiosError.response.data.message}`;
  //         } else if (axiosError.request) {
  //           errorMessage = `Network error`;
  //         } else {
  //           errorMessage = `Unknown error: ${axiosError.message}`;
  //         }
  //       } else if (error instanceof Error) {
  //         errorMessage = `Error: ${error.message}`;
  //       }

  //       console.error(errorMessage);
  //     })
  //     .finally(() => setIsLoading(false));
  // };
  const fetchProducts = (page: number, pageSize: number) => {
    setIsLoading(true);

    productService
      .findAllPaginated(page, pageSize)
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch((error: unknown) => {
        getErrorMessage(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>
        {!isLoading ? (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {products.map((product: Product) => {
              return (
                <Col span={4} key={product.id}>
                  <Card
                    hoverable
                    style={{ marginBottom: "16px" }}
                    cover={<img alt={product.title} src={product.thumbnail} />}
                  >
                    <Card.Meta
                      title={product.title}
                      description={product.description}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Flex
            style={{
              height: "80vh",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin />
          </Flex>
        )}
      </Content>
      <Flex justify="center" style={{ marginBottom: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showTotal={(total) => `Всего ${total} продуктов`}
        />
      </Flex>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
}

export default App;
