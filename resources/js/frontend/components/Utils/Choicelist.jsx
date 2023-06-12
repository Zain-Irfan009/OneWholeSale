import React from 'react'

export function Choicelist({ name, value, checked, onChange, id, label, placeholder, required }) {
    return (
        // <div className="Polaris-Custom-CheckBox">
        //     <label className="Polaris-Choice" htmlFor={id}>
        //         <span className="Polaris-Choice__Control">
        //             <span className="Polaris-Checkbox">
        //                 <input
        //                     id={id}
        //                     type="checkbox"
        //                     className="Polaris-Checkbox__Input"
        //                     aria-invalid="false"
        //                     role="checkbox"
        //                     aria-checked="false"
        //                     value={value}
        //                     checked={checked}
        //                     name={name}
        //                     onChange={onChange}
        //                     required={required}
        //                 />
        //                 <span className="Polaris-Checkbox__Backdrop"></span>
        //                 <span className="Polaris-Checkbox__Icon">
        //                     <span className="Polaris-Icon">
        //                         <span className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--regular Polaris-Text--visuallyHidden">
        //                         </span>
        //                         <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
        //                             <path d="M14.723 6.237a.94.94 0 0 1 .053 1.277l-5.366 6.193a.834.834 0 0 1-.611.293.83.83 0 0 1-.622-.264l-2.927-3.097a.94.94 0 0 1 0-1.278.82.82 0 0 1 1.207 0l2.297 2.43 4.763-5.498a.821.821 0 0 1 1.206-.056Z">
        //                             </path>
        //                         </svg>
        //                     </span>
        //                 </span>
        //             </span>
        //         </span>
        //         {label &&
        //             <span className="Polaris-Choice__Label">
        //                 <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">{label}</span>
        //             </span>
        //         }
        //     </label>
        // </div>

        <fieldset className="Polaris-AlphaStack Polaris-AlphaStack--fullWidth Polaris-AlphaStack--fieldsetReset"
            // style="--pc-stack-align:start;--pc-stack-order:column;--pc-stack-gap-xs:var(--p-space-4);--pc-stack-gap-md:var(--p-space-0)"
            aria-invalid="false"
        >
            {label &&
                <legend className="Polaris-Box"
                // style="--pc-box-padding-block-end-xs:var(--p-space-5);--pc-box-padding-block-end-md:var(--p-space-1)"
                >
                    <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">{label}</span>
                </legend>
            }
            <ul className="Polaris-AlphaStack Polaris-AlphaStack--fullWidth Polaris-AlphaStack--listReset"
            // style="--pc-stack-align:start;--pc-stack-order:column;--pc-stack-gap-xs:var(--p-space-4);--pc-stack-gap-md:var(--p-space-0)"
            >
                <li>
                    <div className="Polaris-Bleed"
                    // style="--pc-bleed-margin-block-end-xs:var(--p-space-0);--pc-bleed-margin-inline-start-xs:var(--p-space-0);--pc-bleed-margin-inline-end-xs:var(--p-space-0)"
                    >
                        <label className="Polaris-Choice" for="PolarisRadioButton1">
                            <span className="Polaris-Choice__Control">
                                <span className="Polaris-RadioButton">
                                    <input
                                        id="PolarisRadioButton1"
                                        name="PolarisChoiceList1"
                                        type="radio"
                                        className="Polaris-RadioButton__Input"
                                        checked=""
                                        value="hidden"
                                    />
                                    <span className="Polaris-RadioButton__Backdrop">
                                    </span>
                                </span>
                            </span>
                            <span className="Polaris-Choice__Label">
                                <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Hidden</span>
                            </span>
                        </label>
                    </div>
                </li>
                {/* <li>
                    <div className="Polaris-Bleed" style="--pc-bleed-margin-block-end-xs:var(--p-space-0);--pc-bleed-margin-inline-start-xs:var(--p-space-0);--pc-bleed-margin-inline-end-xs:var(--p-space-0)">
                        <label className="Polaris-Choice" for="PolarisRadioButton2">
                            <span className="Polaris-Choice__Control">
                                <span className="Polaris-RadioButton">
                                    <input
                                        id="PolarisRadioButton2"
                                        name="PolarisChoiceList1"
                                        type="radio"
                                        className="Polaris-RadioButton__Input"
                                        value="optional"
                                    />
                                    <span className="Polaris-RadioButton__Backdrop">
                                    </span>
                                </span>
                            </span>
                            <span className="Polaris-Choice__Label">
                                <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Optional</span>
                            </span>
                        </label>
                    </div>
                </li>
                <li>
                    <div className="Polaris-Bleed" style="--pc-bleed-margin-block-end-xs:var(--p-space-0);--pc-bleed-margin-inline-start-xs:var(--p-space-0);--pc-bleed-margin-inline-end-xs:var(--p-space-0)">
                        <label className="Polaris-Choice" for="PolarisRadioButton3">
                            <span className="Polaris-Choice__Control">
                                <span className="Polaris-RadioButton">
                                    <input
                                        id="PolarisRadioButton3"
                                        name="PolarisChoiceList1"
                                        type="radio"
                                        className="Polaris-RadioButton__Input"
                                        value="required"
                                    />
                                    <span className="Polaris-RadioButton__Backdrop"> </span>
                                </span>
                            </span>
                            <span className="Polaris-Choice__Label">
                                <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Required</span>
                            </span>
                        </label>
                    </div>
                </li> */}
            </ul>
        </fieldset>
    )
}
