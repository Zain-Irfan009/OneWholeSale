import React from 'react'

export function CustomSelect({ name, value, options, onChange, id, disabled,
    label, placeholder, required, error, helpText, prefix, suffix, marginBottom, marginTop }) {

    function selectedValue(options, value) {
        let sValue = ''
        options?.map((item) => {
            if (item.value == value) {
                sValue = item.label
            }
        })
        return sValue;
    }

    return (
        <div className={`Polaris-Custom-InputField ${marginTop && 'MarginTop '}  ${marginBottom && 'MarginBottom'}`}>
            {label &&
                <div className="Polaris-Labelled__LabelWrapper">
                    <div className="Polaris-Label">
                        <label htmlFor={id} className="Polaris-Label__Text">
                            <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">{label}</span>
                        </label>
                    </div>
                </div>
            }
            <div className={`Polaris-Select ${error ? 'Polaris-Select--error' : ''} `}>
                <select
                    id={id}
                    className="Polaris-Select__Input"
                    aria-invalid="false"
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                >
                    {/* <option value='' disabled selected>Select Country</option> */}
                    {options?.map((item) => {
                        return (
                            <option value={item.value}>{item.label}</option>
                        )
                    })}
                </select>

                <div className="Polaris-Select__Content" aria-hidden="true">
                    <span className="Polaris-Select__SelectedOption">
                        {selectedValue(options, value)}
                    </span>
                    <span className="Polaris-Select__Icon">
                        <span className="Polaris-Icon">
                            <span className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--regular Polaris-Text--visuallyHidden">
                            </span>
                            <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                <path d="M7.676 9h4.648c.563 0 .879-.603.53-1.014l-2.323-2.746a.708.708 0 0 0-1.062 0l-2.324 2.746c-.347.411-.032 1.014.531 1.014Zm4.648 2h-4.648c-.563 0-.878.603-.53 1.014l2.323 2.746c.27.32.792.32 1.062 0l2.323-2.746c.349-.411.033-1.014-.53-1.014Z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </div>
                <div className="Polaris-Select__Backdrop"></div>
            </div>
            {error &&
                <div class="Polaris-Labelled__Error">
                    <div id="PolarisSelect1Error" class="Polaris-InlineError">
                        <div class="Polaris-InlineError__Icon">
                            <span class="Polaris-Icon">
                                <span class="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--regular Polaris-Text--visuallyHidden">
                                </span>
                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                    <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z">
                                    </path>
                                </svg>
                            </span>
                        </div>{error}</div>
                </div>
            }

        </div>
    )
}
