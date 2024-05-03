import { ProductResponse, MetaResponse } from "@/types/product";

export default () => {
  const router = useRouter();
  // get strapi url from runtime config
  const config = useRuntimeConfig();
  const STRAPI_URL: string = config.public.strapi.url;

  // get token from cookies
  const token = useCookie("token");

  // headers for strapi api
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token.value}`,
  };

  const fetchWithTokenCheck = async (url: string, options: RequestInit) => {
    const response = await useFetch(url, options);
    if (response.error.value && response.error.value.status === 400) {
      router.push("/");
    }
    return response;
  };

  // Get all Categories
  const getCategories = async () => {
    return fetchWithTokenCheck(
      `${STRAPI_URL}/categories?sort[0]=id%3Adesc&populate=*`,
      {
        method: "GET",
        headers: headers,
        cache: "no-cache",
      }
    );
  };

  // Get All Products
  const getProducts = async (page: number, pagesize: number) => {
    return fetchWithTokenCheck<ProductResponse & MetaResponse>(
      `${STRAPI_URL}/products?sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${pagesize}&populate=*`,
      {
        method: "GET",
        headers: headers,
        cache: "no-cache",
      }
    );
  };

  // Get Products by id
  const getProductById = async (id: number) => {
    return fetchWithTokenCheck(`${STRAPI_URL}/products/${id}?populate=*`, {
      method: "GET",
      headers: headers,
      cache: "no-cache",
    });
  };
  // Create Product
  const createProduct = async (product: any) => {
    // http://localhost:1337/api/products
    return fetchWithTokenCheck(`${STRAPI_URL}/products`, {
      method: "POST",
      body: product,
      headers: headers,
      cache: "no-cache",
    });
  };

  // Update Product
  const updateProduct = async (id: number, product: any) => {
    return fetchWithTokenCheck(`${STRAPI_URL}/products/${id}`, {
      method: "PUT",
      body: product,
      headers: headers,
      cache: "no-cache",
    });
  };

  // Delete Product
  const deleteProduct = async (id: number) => {
    return fetchWithTokenCheck(`${STRAPI_URL}/products/${id}`, {
      method: "DELETE",
      headers: headers,
      cache: "no-cache",
    });
  };

  const searchProduct = async (keyword: string) => {
    return fetchWithTokenCheck<ProductResponse & MetaResponse>(
      `${STRAPI_URL}/products?populate=*&filters[title][$containsi]=${keyword}`,
      {
        method: "GET",
        headers: headers,
        cache: "no-cache",
      }
    );
  };

  return {
    getCategories,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
  };
};
