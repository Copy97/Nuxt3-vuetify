<script setup lang="ts">
import EditData from "@/components/tables/EditData";
// import useStrapiApi from "@/composables/useStrapiApi";

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Product",
  meta: [
    {
      name: "keywords",
      content: "Product, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Product Nuxt 3,  IT Genius Engineering",
    },
  ],
});

const config = useRuntimeConfig();
const STRAPI_URL_IMAGE: string = config.public.urlroot.url;

// get category list from api in mounted
onMounted(async () => {
  try {
    const response: any = await useStrapiApi()
      .getCategories()
      .then((res) => res.data);

    // console.log(response.value.data)

    // push data to categoryList
    response.value.data.forEach((item: any) => {
      categoryList.value.push({
        name: item.attributes.title,
        id: item.id,
      });
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

// Pagination
const initPage = ref(1);

// Call Product API useStrapiApi
const { data: products } = await useStrapiApi().getProducts(initPage.value, 3);
console.log(products);

// ສ້າງຕົວປ່ຽນເກັບຄ່າ page ທີ່ເລືອກ
const page: any = ref(products.value?.meta.pagination.page);

// ສ້າງຕົວປ່ຽນເກັບຄ່າຈຳນວນໜ້າທັງໝົດ
const pageCount: any = ref(products.value?.meta.pagination.pageCount);

// ສ້າງຟັງຊັນເພື່ອປ່ຽນໜ້າ
const handlePageChange = async (page: any) => {
  initPage.value = page;
  // ສັ່ງໃຫ້ເອີ້ນຂໍ້ມູນໃໝ່
  const { data: newproducts } = await useStrapiApi().getProducts(
    initPage.value,
    3
  );
  products.value = newproducts.value;
};

// Form data =========================
const title = ref("");
const slug = ref("");
const description = ref("");
const price = ref(0);
const qty = ref(0);
const image = ref<File | null>(null);
const category = ref("");
const categoryList = ref([] as any);

// for image preview =================
const files: any = ref([]);
const imageUrl = ref<string | null>(null);

// handle image change
const handleFileChange = async (e: any) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file!);
  image.value = files.value[0];
};

// remove image
const removeImage = () => {
  imageUrl.value = null;
};
// ===================================

// Form Validation ===================
const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => (v && v.length >= 5) || "Title must be at least 5 characters",
];

const slugRules = ref([
  (v: string) => !!v || "Slug is required",
  (v: string) => (v && v.length >= 5) || "Slug must be at least 5 characters",
]);

const priceRules = ref([(v: string) => !!v || "Price is required"]);

const qtyRules = ref([(v: string) => !!v || "Qty is required"]);

const categoryRules = ref([(v: string) => !!v || "Category is required"]);
// ===================================

// Submit Form =======================
const formAddSubmit = async () => {
  // check form validation
  if (
    !title.value ||
    !slug.value ||
    !price.value ||
    !qty.value ||
    !category.value
  ) {
    return;
  } else {
    // form data
    const formData = new FormData();
    const data = {
      title: title.value,
      slug: slug.value,
      description: description.value,
      price: price.value,
      qty: qty.value,
      category: category.value,
    };
    console.log(data);

    // append data to formData
    formData.append("data", JSON.stringify(data));

    // console.log(data)
    // check image
    if (image.value) {
      formData.append("files.image", image.value!);
    }

    // Call API Create Product
    await useStrapiApi().createProduct(formData);

    // reset form
    resetForm();

    // close dialog
    close();

    // reload page product list
    const { data: newproducts } = await useStrapiApi().getProducts(
      initPage.value,
      3
    );
    products.value = newproducts.value;
  }
};

// Get Product By Id =================
const editProduct = async (id: number) => {
  // Call API Get Product by ID
  const { data: product }: any = await useStrapiApi().getProductById(id);

  // console.log(product.value.data.attributes)
  // set form data
  title.value = product.value.data.attributes.title;
  slug.value = product.value.data.attributes.slug;
  description.value = product.value.data.attributes.description;
  price.value = product.value.data.attributes.price;
  qty.value = product.value.data.attributes.qty;
  category.value = product.value.data.attributes.category.data.id;

  // check if product has image
  if (product.value.data.attributes.image.data) {
    // If image more than one read last image
    if (product.value.data.attributes.image.data.length > 1) {
      imageUrl.value = `${STRAPI_URL_IMAGE}${
        product.value.data.attributes.image.data[
          product.value.data.attributes.image.data.length - 1
        ].attributes.formats.thumbnail.url
      }`;
    } else {
      // If image only one read first image
      imageUrl.value = `${STRAPI_URL_IMAGE}${product.value.data.attributes.image.data[0].attributes.formats.thumbnail.url}`;
    }
  } else {
    imageUrl.value = null;
  }

  // Set the edited index and open the dialog
  editedIndex.value = id;
};
// ===================================

// Submit Form Edit ==================
const formEditSubmit = async () => {
  // Check form validation
  if (
    !title.value ||
    !slug.value ||
    !price.value ||
    !qty.value ||
    !category.value
  ) {
    return;
  } else {
    const formData = new FormData();
    const data = {
      title: title.value,
      slug: slug.value,
      description: description.value,
      price: price.value,
      qty: qty.value,
      category: category.value,
    };

    formData.append("data", JSON.stringify(data));

    // console.log(data)

    if (image.value) {
      formData.append("files.image", image.value!);
    }

    // Call API Create Product
    await useStrapiApi().updateProduct(editedIndex.value, formData);

    // Reset Form
    resetForm();

    // Close Dialog
    close();

    // Refresh Product List with current page
    const { data: newproducts } = await useStrapiApi().getProducts(
      initPage.value,
      3
    );
    products.value = newproducts.value;
  }
};

// ===================================

// Delete Product ====================
const deleteProduct = async (id: number) => {
  // Call API Delete Product
  await useStrapiApi().deleteProduct(id);

  // Close Dialog
  close();

  // Refresh Product List
  const { data: newproducts } = await useStrapiApi().getProducts(
    initPage.value,
    3
  );
  products.value = newproducts.value;
};

// Dialog ================================
const dialog = ref(false);
const deletedialog = ref(false);
const search = ref("");
const editedIndex = ref(-1);
const deleteIndex = ref(-1);

// Close Dialog
function close() {
  dialog.value = false;
  deletedialog.value = false;
  setTimeout(() => {}, 300);
}
// Reset Form
const resetForm = () => {
  title.value = "";
  slug.value = "";
  description.value = "";
  image.value = null;
  files.value = [];
  price.value = 0;
  qty.value = 0;
  category.value = "";
  imageUrl.value = null;
};

//Methods
const filteredList = computed(() => {
  return desserts.value.filter((user: any) => {
    return user.userinfo.toLowerCase().includes(search.value.toLowerCase());
  });
});

//Computed Property
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Add New Product" : "Edit Product";
});

const formSearchSubmit = async () => {
  // Search Product List
  if (!search.value) {
    const { data: newproducts }  = await useStrapiApi().getProducts(initPage.value, 3);
    pageCount.value = newproducts.value.meta.pagination.pageCount;

  } else {
    const { data: searchProduct } = await useStrapiApi().searchProduct(
      search.value
    );
    products.value = searchProduct.value;
    pageCount.value = searchProduct.value.meta.pagination.pageCount;
  }
};
</script>

<template>
  <!-- Add / Edit Product Dialog -->
  <v-dialog v-model="dialog" width="800">
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="title text-white">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form
            fast-fail
            ref="form"
            @submit.prevent="
              editedIndex === -1 ? formAddSubmit() : formEditSubmit()
            "
          >
            <v-row>
              <v-col cols="12" sm="6">
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="title"
                    :rules="titleRules"
                    label="Title"
                    hide-details="auto"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="slug"
                    :rules="slugRules"
                    label="Slug"
                    hide-details="auto"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea
                    v-model="description"
                    label="Description"
                    hide-details="auto"
                    variant="outlined"
                    rows="5"
                  ></v-textarea>
                </v-col>
              </v-col>

              <v-col cols="12" sm="6">
                <v-col cols="12" sm="12">
                  <!-- Preview Image -->
                  <v-img v-if="imageUrl" :src="imageUrl" class="img-prview">
                    <v-btn icon @click="removeImage">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-img>

                  <!-- Image Inputs -->
                  <v-file-input
                    @change="handleFileChange"
                    v-model="files"
                    label="Image"
                    hide-details="auto"
                    outlined
                    dense
                    prepend-icon="mdi-image"
                    accept="image/*"
                  ></v-file-input>
                </v-col>

                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="price"
                    :rules="priceRules"
                    label="Price"
                    hide-details="auto"
                    variant="outlined"
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="qty"
                    :rules="qtyRules"
                    label="Qty"
                    hide-details="auto"
                    variant="outlined"
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                  <v-select
                    v-model="category"
                    :rules="categoryRules"
                    :items="categoryList"
                    item-title="name"
                    item-value="id"
                    label="Category"
                    hide-details="auto"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-col>
            </v-row>

            <!-- Button Submit -->
            <v-card-actions class="pl-3">
              <v-btn
                color="secondary"
                size="large"
                variant="elevated"
                type="submit"
                >Submit</v-btn
              >
              <v-btn color="error" size="large" @click="close">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Confirm Delete Dialog -->
  <v-dialog v-model="deletedialog" width="auto">
    <v-card>
      <v-card-title class="text-h6 mx-3 mt-3">
        Confirm delete product Id: {{ deleteIndex }} ?
      </v-card-title>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="red-darken-1"
          class="text-button"
          variant="text"
          @click="deleteProduct(deleteIndex)"
        >
          Delete
        </v-btn>
        <v-btn
          color="grey-darken-1"
          class="text-button"
          variant="text"
          @click="deletedialog = false"
        >
          Cancle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-form fast-fail ref="form" @submit.prevent="formSearchSubmit()">
                <v-text-field
                  density="compact"
                  v-model="search"
                  label="Search Products"
                  hide-details
                  variant="outlined"
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <v-btn
                color="primary"
                class="ml-auto"
                variant="elevated"
                @click="
                  dialog = true;
                  editedIndex = -1;
                  resetForm();
                "
              >
                <MIcon name="ph:plus" /> Add Product
              </v-btn>
            </v-col>
          </v-row>

          <v-pagination
            v-model="page"
            :length="pageCount"
            @next="handlePageChange"
            @prev="handlePageChange"
            @update:modelValue="handlePageChange"
            next-icon="mdi-chevron-right"
            prev-icon="mdi-chevron-left"
          ></v-pagination>

          <v-table class="mt-5">
            <thead>
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>ProductInfo</th>
                <th>price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="product in products?.data" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <div class="d-flex align-center py-4">
                    <div v-if="product.attributes.image.data">
                      <!-- If image more than one read last image -->
                      <v-img
                        v-if="product.attributes.image.data.length > 1"
                        :src="`${STRAPI_URL_IMAGE}${
                          product.attributes.image.data[
                            product.attributes.image.data.length - 1
                          ].attributes.url
                        }`"
                        width="45px"
                        class="rounded-circle img-fluid"
                      ></v-img>
                      <!-- {{ `${STRAPI_URL_IMAGE}${product.attributes.image.data[product.attributes.image.data.length - 1].attributes.url}`}} -->
                      <!-- If image only one read first image -->
                      <v-img
                        v-else
                        :src="`${STRAPI_URL_IMAGE}${product.attributes.image.data[0].attributes.url}`"
                        width="45px"
                        class="rounded-circle img-fluid"
                      ></v-img>
                    </div>
                    <div v-else>
                      <v-icon size="45">mdi-image</v-icon>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="ml-5">
                    <h4>{{ product.attributes.title }}</h4>
                    <span
                      class="subtitle-2 d-block font-weight-regular"
                      v-if="product.attributes.description"
                    >
                      {{
                        product.attributes.description.slice(0, 150)
                      }}...</span
                    >
                  </div>
                </td>
                <td>{{ product.attributes.price }}</td>
                <td>{{ product.attributes.qty }}</td>

                <td>
                  <v-icon
                    small
                    class="mr-2 text-info cursor-pointer"
                    title="Edit"
                    @click="
                      dialog = true;
                      editedIndex = 1;
                      editProduct(product.id);
                    "
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    small
                    class="text-error cursor-pointer"
                    title="Delete"
                    @click="
                      deletedialog = true;
                      deleteIndex = product.id;
                    "
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
