import React, { useEffect, useState } from 'react';
import iconMap from '../../assets/Icons';
import IconButton from '@mui/material/IconButton';
import { TextField, Autocomplete } from '@mui/material';
import { CategoryInterface, ProductInterface } from '../Interface';
import { category, deleteCategory, deleteProduct, editCategory, editProduct, postCategory, postProduct, product } from '../../common_component/services';
import { GridColDef } from '@mui/x-data-grid';
import Table from '../../common_component/Table/Table';
import { useSearch } from '../../common_component/menu/SearchContext';

function Products() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { searchTerm } = useSearch();
  const [pandC, setPandC] = useState({
    add: false,
    editProduct: false,
    editCategory: false,
    deletProduct: false,
    deleteCategory: false,
    all: false
  });
  const [selection, setSelection] = useState('Product');
  const [input, setInput] = useState({
    categoryName: '',
    productName: '',
    amount: '',
    unit: '',
    value: ''
  })
  const [visval, setVisval] = useState({
    Delete: false,
    Edit: false
  })
  const [selectedProduct, setSelectedProduct] = useState<ProductInterface[]>([])
  const [error, setError] = useState({
    category: '',
    product: '',
    amount: '',
  })
  const IconAdd = iconMap['addIcon'];
  const IconClose = iconMap['close'];
  const Delete = iconMap['Deleteicon'];
  const Edit = iconMap['Editicon'];
  const [getcategory, setCategory] = useState<CategoryInterface[]>([])
  const [getProduct, setProduct] = useState<ProductInterface[]>([])
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [filterProduct, setFilterProduct] = useState({
    categoryName: '',
    productFilter: '',
    categoryId: ''
  })

  useEffect(() => {
    fetchCategoriesAndProducts()
    setSelection('Product')
    setFilterProduct({
      ...filterProduct,
      categoryId: ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategoriesAndProducts = () => {
    category().then((res) => {
      const categoryName: CategoryInterface[] = res.data
      setCategory(categoryName);
    }).catch((error) => {
      console.error('error', error);
    })
    product().then((res) => {
      const Prosucts: ProductInterface[] = res.data
      setProduct(Prosucts)
      setProducts(Prosucts)
    }).catch((error) => {
      console.error('error', error);
    })
  }
  const columns: GridColDef[] = [
    { field: 'serial', headerName: 'S.No', type: 'number', flex: 0.3, sortable: false, disableColumnMenu: true, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { field: 'productName', headerName: 'Product Name', flex: 1, },
    {
      field: 'categoryType', headerName: 'Category Type', flex: 1,  renderCell: (params) => {
        const category = getcategory.find((cat) => cat._id === params.value);
        return category ? category.name : 'Unknown';
      },
    },
    { field: 'amount', headerName: 'Price Value', type: 'number', flex: 1 }
  ];

  const clear = () => {
    setInput({
      categoryName: '',
      productName: '',
      amount: '',
      unit: '',
      value: '',
    })
  }

  const close = () => {
    setPandC({
      add: false,
      editProduct: false,
      editCategory: false,
      deletProduct: false,
      deleteCategory: false,
      all: false
    })
    setSelection('Product')
    setFilterProduct({
      categoryName: '',
      productFilter: '',
      categoryId: ''
    })
    productfind('')
  }

  const postData = () => {
    if (selection === 'Product') {
      if (input.amount && input.categoryName && input.productName) {
        postProduct(input).then((res: any) => {
          console.log(res);
          fetchCategoriesAndProducts()
          close()
          clear()
        }).catch((error: any) => {
          console.error('error', error);
          if (error.response.data.error === 'Category name already exists for this business.') {
            setError({ ...error, category: 'Category name already exists' })
          }
        })
      }
    } else if (selection === 'Category') {
      if (input.categoryName) {
        postCategory(input).then((res) => {
          fetchCategoriesAndProducts()
          close()
          clear()
        }).catch((error) => {
          console.error('error', error.response.data.error);
          if (error.response.data.error === 'Category name already exists for this business.') {
            setError({ ...error, category: 'Category name already exists' })
          }
        })
      }
    }
  }

  const filteredData = products.filter(product=>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())||
    product.amount.toString().includes(searchTerm)
  )

  const inputBox = (name: string, type: any, onchange: (value: string) => void, errorMsg: any, clearError: () => void, value: any) => {
    return (
      <TextField
        type={type}
        label={name}
        value={value}
        className='mt-3 border-2 w-full pl-10 h-20 rounded-lg'
        onChange={(e) => {
          const value = e.target.value;
          if (type === 'number' && Number(value) < 0) {
            return;
          }
          onchange(value);
          clearError();
        }}
        required
        InputProps={
          type === 'number'
            ? { inputProps: { maxLength: 10, min: 0 } }
            : { inputProps: { maxLength: 30 } }
        }
        helperText={errorMsg}
        error={!!errorMsg}
      />
    )
  }

  const radio = (onchange1: (value: string) => void, name: string, selected: any, onchange2: (value: string) => void, lable: string, disable: any) => {
    return (
      <div className='mx-5 my-3 flex justify-center items-center w-auto'>
        <input type="radio" name={name} value={selected} onChange={(e) => { const value = e.target.value; onchange1(value) }} />
        <input
          className='mx-2 w-24 border-2 rounded-md border-neutral-400'
          id="radio select value"
          placeholder={lable}
          onChange={(e) => { const value = e.target.value; onchange2(value) }}
          disabled={!disable}
        />
      </div>
    )

  }

  const productData = getcategory.map((i) => ({
    label: i.name,
    value: i._id,
  }));

  const add = [
    { label: 'Product', value: 'Product' },
    { label: 'Category', value: 'Category' },
  ];

  const productfind = (selectedCategory: any) => {
    if (selectedCategory) {
      const filteredData = getProduct.filter(
        (product) => product.categoryType === selectedCategory.value
      );
      setProducts(filteredData);
    } else {
      setProducts(getProduct);
    }
  };

  const handleSelectedData = (selectedRows: any[]) => {
    setSelectedProduct(selectedRows)
    if (selectedRows.length > 0) {
      if (selectedRows.length === 1) {
        setVisval({
          Delete: true,
          Edit: true
        })
      } else if (selectedRows.length > 1) {
        setVisval({
          Delete: true,
          Edit: false
        })
      }
    } else {
      setVisval({
        Delete: false,
        Edit: false
      })

    }
  };

  const buttonExpand = (name: string, onClick: () => void, IconComponent: React.ElementType) => (
    <div
      className={`bg-blue-700 mx-5 h-16 rounded-full flex justify-center items-center transition-all cursor-pointer duration-400 
        ${hoveredButton === name ? 'w-auto' : 'w-16'}`}
      onMouseEnter={() => setHoveredButton(name)}
      onMouseLeave={() => setHoveredButton(null)}
      onClick={onClick}
    >
      <IconButton aria-label={name}>
        <IconComponent />
        {hoveredButton === name && <p className="mx-2 text-lg font-bold text-white">{name}</p>}
      </IconButton>
    </div>
  );
  const confirmDelete = (selected: string) => {
    if (selected === 'Product') {
      const ids = selectedProduct.map(i => i._id)
      deleteProduct(ids).then((res) => {
        close()
        clear()
        fetchCategoriesAndProducts()
      }).catch((error) => {
        console.error(error)
      })
    } else if (selected === 'Category') {
      deleteCategory(filterProduct.categoryId).then((res) => {
        const ids = products.map(i => i._id)
        if (ids.length > 0) {
          deleteProduct(ids).then((res) => {
            fetchCategoriesAndProducts()
            close()
            clear()
          }).catch((error) => {
            console.error(error)
          })
        } else {
          fetchCategoriesAndProducts()
          close()
          clear()
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }
  const confirmEdit = (selected: any) => {
    if (selected === 'Category') {
      if (input.categoryName !== filterProduct.categoryName) {
        editCategory(filterProduct.categoryId, input.categoryName)
          .then((res) => {
            fetchCategoriesAndProducts()
            close()
            clear()
          }).catch((error) => {
            console.error(error);
            setError({ ...error, category: 'Category Name is alredy exist' })
          })
      } else {
        setError({ ...error, category: 'Pls chance the Category Name' })
      }
    } else if (selected === 'Product') {
      const confirm = () => (
        Number(input.amount) !== selectedProduct[0].amount ||
        input.categoryName !== selectedProduct[0].categoryType ||
        input.productName !== selectedProduct[0].productName
      );
      if (confirm()) {
        console.log(input);
        editProduct(input, selectedProduct[0]._id)
          .then((res) => {
            close()
            clear()
            setProducts([])
            fetchCategoriesAndProducts()
          }).catch((error) => {
            console.error(error);
            setError({
              category: '',
              product: 'Alredy Product name is exit',
              amount: '',
            })
          })
      } else {
        setError({
          category: '',
          product: 'Are in equal',
          amount: 'Are in equal',
        })
      }
    }

  }
  const editPData = () => {
    if (selectedProduct.length > 0) {
      const product = selectedProduct[0];
      setInput({
        ...input,
        categoryName: product.categoryType,
        productName: product.productName,
        amount: String(product.amount),
        unit: '',
      });
    }
  };

  return (
    <div className="flex w-full h-full flex-col items-center">
      <div className="flex justify-between ml-20 m-5 w-full mt-4 pr-20">
        <div className='flex'>
          <Autocomplete
            className="w-80 mx-5 mt-2 mb-2"
            disablePortal
            value={productData.find(option => option.value === filterProduct.categoryId) || null}
            options={productData}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Filter by Category" />}
            onChange={(event, newValue) => {
              setFilterProduct({
                ...filterProduct,
                categoryName: newValue?.label || '', categoryId: newValue?.value || ''
              });
              productfind(newValue);
            }}
          />
          {filterProduct.categoryName && <div className='flex flex-col'>
            <IconButton aria-label="categoryEdit" onClick={() => { setPandC({ ...pandC, all: true, editCategory: true }); setInput({ ...input, categoryName: filterProduct.categoryName }) }} >
              <Edit />
            </IconButton>
            <IconButton aria-label="categoryDelete" onClick={() => setPandC({ ...pandC, all: true, deleteCategory: true })}>
              <Delete />
            </IconButton>
          </div>}
        </div>
        <div className='flex'>
          {visval.Edit && buttonExpand('Edit Product', () => { setPandC({ ...pandC, editProduct: true, all: true }); editPData() }, iconMap['Edit'])}
          {visval.Delete && buttonExpand('Delete Product', () => setPandC({ ...pandC, deletProduct: true, all: true }), iconMap['Delete'])}
          {buttonExpand('Product & Category', () => setPandC({ ...pandC, add: true, all: true }), IconAdd)}
        </div>
      </div>
      <div>
        {pandC.all && (
          <div className="modal">
            <div className='w-96 flex justify-end -mb-7 -mr-2'>
              <IconButton aria-label="product and category" onClick={close}>
                <IconClose />
              </IconButton>
            </div>
            {pandC.add && <div className="modal-popup pt-2">
              <div className="w-96 h-auto flex flex-col items-center m-2 mt-5">
                <Autocomplete
                  className="w-full"
                  disablePortal
                  value={add.find(option => option.value === selection)}
                  options={add}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} label="Select Add Product or Category" />}
                  onChange={(event, newValue) => { setSelection(newValue ? newValue.value : ''); clear() }}
                />
                <div className="my-4">
                  {selection === 'Product' && <h1>Add Product</h1>}
                  {selection === 'Category' && <h1> Add Category</h1>}
                </div>
                {selection === 'Product' &&
                  <div className='w-full'>
                    {inputBox('Product Name', 'text', (value) => setInput({ ...input, productName: value }), error.product, () => setError({ ...error, product: '' }), input.productName)}
                    <div className='flex'>
                      {radio(() => setInput({ ...input, unit: 'psc' }), 'measurement', 'psc', (value) => setInput({ ...input, value: value }), 'min 1 qty', input.unit === 'psc')}
                      {radio(() => setInput({ ...input, unit: 'gms' }), 'measurement', 'gms', (value) => setInput({ ...input, value: value }), 'min 10 gms', input.unit === 'gms')}
                    </div>
                    {inputBox('Amount', 'number', (value) => setInput({ ...input, amount: value }), error.amount, () => setError({ ...error, amount: '' }), input.amount,)}
                    <Autocomplete
                      className='w-full'
                      disablePortal
                      options={productData}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} label="Select Category Type" />}
                      onChange={(event, newValue) => setInput({ ...input, categoryName: newValue ? newValue.value : '' })}
                    />
                    <div className='w-full flex justify-center'>
                      <button className='cancel' onClick={close}>Cancel</button>
                      <button className='confirm' onClick={() => postData()}>Confirm</button>
                    </div>

                  </div>}
                {selection === 'Category' &&
                  <div className='w-full'>
                    {inputBox('Category Name', 'text', (value) => setInput({ ...input, categoryName: value }), error.category, () => setError({ ...error, category: '' }), input.categoryName)}
                    <div className='w-full flex justify-center'>
                      <button className='cancel' onClick={close}>Cancel</button>
                      <button className='confirm' onClick={() => postData()}>Confirm</button>
                    </div>
                  </div>}
              </div>
            </div>}
            {pandC.deletProduct && <div className="modal-popup pt-2">
              <div className='flex w-auto h-auto justify-center items-center p-5 flex-col'>
                <h1>Are you confirm to Delete the following <br /> Products:</h1>
                {selectedProduct.map((i, index) =>
                  <div className='flex w-4/5'>
                    <p>{index + 1}.</p>
                    <p className='pl-1'>{i.productName}</p>
                  </div>)}
                <div className='w-full flex justify-center'>
                  <button className='cancel' onClick={close}>Cancel</button>
                  <button className='confirm' onClick={() => confirmDelete('Product')}>Delete</button>
                </div>
              </div>
            </div>}
            {pandC.deleteCategory && <div className="modal-popup pt-2 flex-col">
              <div className='flex w-auto h-auto justify-center items-center p-2 flex-col'>
                <h1>Confirm to Delete this Category</h1>
                <p className='text-3xl font-bold'>{filterProduct.categoryName}</p>
                <p className='text-red-600 w-96'>Included in the category The product was automatically erased as well.
                  Do you want to remove?</p>
              </div>
              <div className='w-full flex justify-center'>
                <button className='cancel' onClick={close}>Cancel</button>
                <button className='confirm' onClick={() => confirmDelete('Category')}>Delete</button>
              </div>
            </div>}
            {pandC.editCategory && <div className="modal-popup flex-col ">
              <div className='flex w-96 h-auto justify-center items-center p-2 flex-col'>
                <h1 className='mb-5'>Edit for selected Category</h1>
                {inputBox('Edit Category Name', 'text', (value) => setInput({ ...input, categoryName: value }), error.category, () => setError({ ...error, category: '' }), input.categoryName,)}
                <div className='w-full flex justify-center'>
                  <button className='cancel' onClick={close}>Cancel</button>
                  <button className='confirm' onClick={() => confirmEdit('Category')}>Edit</button>
                </div>
              </div>
            </div>}
            {pandC.editProduct && <div className="modal-popup flex-col">
              <div className='flex w-96 h-auto justify-center items-center p-2 flex-col'>
                <div className='w-full'>
                  <h1 className='w-full flex justify-center mb-4'>Edit Prosuct</h1>
                  {inputBox('Product Name', 'text', (value) => setInput({ ...input, productName: value }), error.product, () => setError({ ...error, product: '' }), input.productName)}
                  <div className='flex'>
                    {radio(() => setInput({ ...input, unit: 'psc' }), 'measurement', 'psc', (value) => setInput({ ...input, value: value }), 'min 1 qty', input.unit === 'psc')}
                    {radio(() => setInput({ ...input, unit: 'gms' }), 'measurement', 'gms', (value) => setInput({ ...input, value: value }), 'min 10 gms', input.unit === 'gms')}
                  </div>
                  {inputBox('Amount', 'number', (value) => setInput({ ...input, amount: value }), error.amount, () => setError({ ...error, amount: '' }), input.amount,)}
                  <Autocomplete
                    className='w-full'
                    disablePortal
                    value={productData.find(option => option.value === input.categoryName)}
                    options={productData}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Select Category Type" />}
                    onChange={(event, newValue) => setInput({ ...input, categoryName: newValue ? newValue.value : '' })}
                  />
                  <div className='w-full flex justify-center'>
                    <button className='cancel' onClick={close}>Cancel</button>
                    <button className='confirm' onClick={() => confirmEdit('Product')}>Confirm</button>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        )}
      </div>
      <div className='w-5/6 max-w-3xl p-5 flex h-4/6 justify-center'>
        <Table rows={filteredData} columns={columns} onSelectionChange={handleSelectedData} />
      </div>
    </div>
  );
}

export default Products;
