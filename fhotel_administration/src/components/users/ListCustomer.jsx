import React from 'react'
import Header from '../Header'
import SideBar from '../SideBar'

const ListCustomer = () => {
    return (
        <>
            <Header />
            <SideBar />
            <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
                {/* START PAGE CONTENT*/}
                <div className="page-heading">
                    <h1 className="page-title">List of Customers</h1>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html"><i className="la la-home font-20" /></a>
                        </li>
                        {/* <li className="breadcrumb-item">Basic Tables</li> */}
                    </ol>
                </div>
                <div className="page-content fade-in-up">
                    <div className="ibox">
                        <div className="ibox-head">
                            <div className="ibox-title">Responsive Table</div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th width="50px" />
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Data</th>
                                            <th>Last Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <label className="ui-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="input-span" />
                                                </label>
                                            </td>
                                            <td>iphone case</td>
                                            <td>$1200</td>
                                            <td>33%</td>
                                            <td>02/08/2017</td>
                                            <td>
                                                <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" /></button>
                                                <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label className="ui-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="input-span" />
                                                </label>
                                            </td>
                                            <td>Car covers</td>
                                            <td>$3280</td>
                                            <td>42%</td>
                                            <td>08/10/2017</td>
                                            <td>
                                                <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" /></button>
                                                <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label className="ui-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="input-span" />
                                                </label>
                                            </td>
                                            <td>Compressors</td>
                                            <td>$7400</td>
                                            <td>56%</td>
                                            <td>14/11/2017</td>
                                            <td>
                                                <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" /></button>
                                                <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </>
    )
}

export default ListCustomer