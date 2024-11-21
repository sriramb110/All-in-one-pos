import React, { useEffect, useState } from 'react'
import { deleteCustomer, editCustomer, getCustomer, postCustomer } from '../../common_component/services'
import Table from '../../common_component/Table/Table'
import { Customer } from '../Interface'
import { GridColDef } from '@mui/x-data-grid'
import { IconButton, TextField } from '@mui/material'
import iconMap from '../../assets/Icons'
import { useSearch } from '../../common_component/menu/SearchContext'

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { searchTerm } = useSearch();
  const IconClose = iconMap['close'];
  const [visval, setVisval] = useState({
    Delete: false,
    Edit: false
  })
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [custChange, setCustChange] = useState({
    add: false,
    editCustomer: false,
    deletCustomer: false,
    addCustomer: false,
    all: false
  });
  const [input, setInput] = useState({
    Name: '',
    PhoneNumber: '',
    EmailId: ''
  })
  const [edit, setEdit] = useState({
    Name: '',
    PhoneNumber: '',
    EmailId: '',
    id:''
  })
  const [error, setError] = useState({
    Name: '',
    PhoneNumber: '',
    EmailId: ''
  })
  const [selected, setSelected] = useState<Customer[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = () => {
    getCustomer().then((res) => {
      const customers: Customer[] = res.data
      setCustomers(customers)
    }).catch((error) => {
      console.error(error);
    })
  }

  const filteredData = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.toString().includes(searchTerm) ||
    customer.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'serial', headerName: 'S.No', type: 'number', width: 60, sortable: false, disableColumnMenu: true, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { field: 'customerName', headerName: 'Customer Name', width: 300 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 300 },
    { field: 'emailId', headerName: 'Email ID', width: 400 }
  ]

  const handleSelectedData = (selectedRows: Customer[]) => {
    setSelected(selectedRows)
    if (selectedRows.length > 1) {
      setVisval({
        Delete: true,
        Edit: false
      })
      setEdit({
        Name: '',
        PhoneNumber: '',
        EmailId: '',
        id:''
      })
    } else if (selectedRows.length === 1) {
      setVisval({
        Delete: true,
        Edit: true
      })
      setEdit({
        Name: selectedRows[0].customerName,
        PhoneNumber: String(selectedRows[0].phoneNumber),
        EmailId: selectedRows[0].emailId,
        id:selectedRows[0]._id
      })
    } else {
      setVisval({
        Delete: false,
        Edit: false
      })
      setEdit({
        Name: '',
        PhoneNumber: '',
        EmailId: '',
        id:''
      })
    }
  }

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

  const close = () => {
    setCustChange({
      add: false,
      editCustomer: false,
      deletCustomer: false,
      addCustomer: false,
      all: false
    })
    setInput({
      Name: '',
      PhoneNumber: '',
      EmailId: ''
    })
    setError({
      Name: '',
      PhoneNumber: '',
      EmailId: ''
    })
  }

  const inputBox = (name: string, type: any, onchange: (value: string) => void, errorMsg: any, clearError: () => void, data: any, required: boolean) => {
    const emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    return (
      <TextField
        type={type}
        label={name}
        value={data}
        className='mt-3 border-2 w-full pl-10 h-20 rounded-lg'
        onChange={(e) => {
          const value = e.target.value;
          if (type === 'number' && Number(value) < 0) {
            return;
          }
          onchange(value);
          clearError();
        }}
        required={required}
        InputProps={{
          inputProps: {
            maxLength: type === 'number' ? 10 : 30,
            min: type === 'number' ? 0 : undefined,
            pattern: type === 'email' ? emailPattern : undefined
          },
          type: type
        }}
        helperText={errorMsg}
        error={!!errorMsg}
      />
    )
  }

  const popupbtn = (confirm: any, btn: string) => {
    return (
      <div className='w-full flex justify-center'>
        <button className='cancel' onClick={close}>Cancel</button>
        <button className='confirm' onClick={() => confirm()}>{btn}</button>
      </div>
    )
  }

  const post = () => {
    postCustomer(input).then((res) => {
      close()
      fetchCustomers()
    }).catch((error) => console.error(error.response.data.error))
  }
  const deletes = () => {
    const id = selected.map(i => i._id)
    deleteCustomer(id).then((res) => {
      close()
      fetchCustomers()
    }).catch((error) => {

    })
  }
  const editinput = ()=>{
    const selectedEdit = selected[0]
    if(selectedEdit.customerName !== edit.Name || Number(selectedEdit.phoneNumber) !== Number(edit.PhoneNumber) || selectedEdit.emailId !== edit.EmailId){
      editCustomer(edit).then((res)=>{
        fetchCustomers()
        close()
      }).catch((error)=>{
        console.log(error)
      })
    }else{
      console.log('all are is same value');
    }
  }

  return (
    <div
      className="w-full h-full flex items-center flex-col"
    >
      <div className="w-11/12 h-20 flex ml-20 mt-4 justify-end pr-2">
        {visval.Edit &&
          buttonExpand(
            "Edit Product",
            () => {
              setCustChange({ ...custChange, editCustomer: true, all: true });
            },
            iconMap["Edit"]
          )}
        {visval.Delete &&
          buttonExpand(
            "Delete Product",
            () =>
              setCustChange({ ...custChange, deletCustomer: true, all: true }),
            iconMap["Delete"]
          )}
        {buttonExpand(
          "Customer",
          () => setCustChange({ ...custChange, addCustomer: true, all: true }),
          iconMap["addIcon"]
        )}
      </div>
      <div className="w-full p-5 flex h-4/6 justify-center">
        <Table
          rows={filteredData}
          columns={columns}
          onSelectionChange={handleSelectedData}
        />
      </div>
      {custChange.all && (
        <div className="modal">
          <div className="w-96 flex justify-end -mb-7 -mr-2">
            <IconButton aria-label="product and category" onClick={close}>
              <IconClose />
            </IconButton>
          </div>
          <div className="modal-popup  pt-6">
            {custChange.addCustomer && (
              <div className="w-96 m-2 flex justify-center items-center flex-col">
                <h1 className="mb-2">Add Customer</h1>
                {inputBox(
                  "Name",
                  "text",
                  (value) => setInput({ ...input, Name: value }),
                  error.Name,
                  () => setError({ ...error, Name: "" }),
                  input.Name,
                  true
                )}
                {inputBox(
                  "Phone Number",
                  "number",
                  (value) => setInput({ ...input, PhoneNumber: value }),
                  error.PhoneNumber,
                  () => setError({ ...error, PhoneNumber: "" }),
                  input.PhoneNumber,
                  true
                )}
                {inputBox(
                  "Email Id",
                  "string",
                  (value) => setInput({ ...input, EmailId: value }),
                  error.EmailId,
                  () => setError({ ...error, EmailId: "" }),
                  input.EmailId,
                  false
                )}
                {popupbtn(post, "Confirm")}
              </div>
            )}
            {custChange.deletCustomer && (
              <div className="w-96 flex items-center flex-col">
                <h1>Confirm to Delete</h1>
                {selected.map((i, index) => (
                  <div className="w-52">
                    {index + 1}. {i.customerName}
                  </div>
                ))}
                {popupbtn(deletes, "Confirm")}
              </div>
            )}
            {custChange.editCustomer && (
              <div className="w-96 flex items-center flex-col m-2">
                <h1 className="mb-2">Edit Customer</h1>
                {inputBox(
                  "Name",
                  "text",
                  (value) => setEdit({ ...edit, Name: value }),
                  error.Name,
                  () => setError({ ...error, Name: "" }),
                  edit.Name,
                  true
                )}
                {inputBox(
                  "Phone Number",
                  "number",
                  (value) => setEdit({ ...edit, PhoneNumber: value }),
                  error.PhoneNumber,
                  () => setError({ ...error, PhoneNumber: "" }),
                  edit.PhoneNumber,
                  true
                )}
                {inputBox(
                  "Email Id",
                  "email",
                  (value) => setEdit({ ...edit, EmailId: value }),
                  error.EmailId,
                  () => setError({ ...error, EmailId: "" }),
                  edit.EmailId,
                  false
                )}
                {popupbtn(editinput, "Confirm")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
