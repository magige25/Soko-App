import React from 'react'
import { Icon } from '@iconify/react';

const UnitCountOne = () => {
    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-5 row-cols-sm-2 row-cols-1 gy-4">
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1 fs-12">Total Customers</p>
                                <h6 className="mb-0 fs-10">20,000</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="gridicons:multiple-users"
                                    className="text-white text-xxl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="fs-12 d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="fs-12" /> +5000
                            </span>
                            Last 30 days customers
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1 fs-12">Total Stock</p>
                                <h6 className="mb-0 fs-10">150,000</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:package-variant-closed"
                                    className="text-white text-xxl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                                <Icon icon="bxs:down-arrow" className="fs-12" /> -800
                            </span>
                            Last 30 days stock
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1 fs-12">Total Payments</p>
                                <h6 className="mb-0 fs-10">$100,000</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:credit-card-outline"
                                    className="text-white text-xxl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="fs-12" /> +$2000
                            </span>
                            Last 30 days payment
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-4 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1 fs-12">Total Orders</p>
                                <h6 className="mb-0 fs-10">$420,000</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:cart-outline"
                                    className="text-white text-xxl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="fs-12" /> +$20,0000
                            </span>
                            Last 30 days orders
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-5 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1 fs-12">Total Expense</p>
                                <h6 className="mb-0 fs-10">$80,000</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="fa6-solid:file-invoice-dollar"
                                    className="text-white text-xxl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="fs-12" /> +$5,000
                            </span>
                            Last 30 days expense
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
        </div>
    )
}

export default UnitCountOne