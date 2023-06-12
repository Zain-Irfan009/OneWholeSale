import React from 'react'

export function CheckBox({ name, value, type, marginTop, marginBottom, checked, onChange, id, label, placeholder, required }) {
    return (
        <div className={`Polaris-Custom-CheckBox ${marginTop && 'MarginTop '} ${marginBottom && 'MarginBottom'}`}>
            <label className="Polaris-Choice" htmlFor={id}>
                <span className="Polaris-Choice__Control">
                    <span className="Polaris-Checkbox">
                        <input
                            id={id}
                            type="checkbox"
                            className="Polaris-Checkbox__Input"
                            aria-invalid="false"
                            role="checkbox"
                            aria-checked="false"
                            value={value}
                            checked={checked}
                            name={name}
                            onChange={onChange}
                            required={required}
                        />
                        <span className="Polaris-Checkbox__Backdrop"></span>
                        <span className="Polaris-Checkbox__Icon">
                            <span className="Polaris-Icon">
                                <span className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--regular Polaris-Text--visuallyHidden">
                                </span>
                                <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                    <path d="M14.723 6.237a.94.94 0 0 1 .053 1.277l-5.366 6.193a.834.834 0 0 1-.611.293.83.83 0 0 1-.622-.264l-2.927-3.097a.94.94 0 0 1 0-1.278.82.82 0 0 1 1.207 0l2.297 2.43 4.763-5.498a.821.821 0 0 1 1.206-.056Z">
                                    </path>
                                </svg>
                            </span>
                        </span>
                    </span>
                </span>
                {label &&
                    <span className="Polaris-Choice__Label">
                        <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">{label}</span>
                    </span>
                }
            </label>
        </div>
    )
}
