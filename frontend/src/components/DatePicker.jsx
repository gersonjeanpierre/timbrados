import { forwardRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { styleJsxGlobal } from "../utils/datePicker";

function DatePicker1(props) {

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    <div>
      <style>{styleJsxGlobal}</style>
      <DatePicker
        {...props}
        popperModifiers={[
          {
            name: "arrow",
            options: {
              padding: {
                left: 24,
                right: 24,
              },
            },
          },
          ...(props.popperModifiers ?? []),
        ]}
      />
    </div>
  );
}

function InputGroup6({
  label,
  name,
  value,
  onChange,
  type = "text",
  decoration,
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) {
  return (
    <div className="flex flex-row items-stretch w-full">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={label}
        aria-label={label}
        className={`peer block w-full p-3 text-gray-600 bg-gray-100 border border-r-0 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-0 appearance-none rounded-tr-none rounded-br-none rounded transition-colors duration-300 ${disabled ? "bg-gray-200" : ""
          } ${inputClassName}`}
        disabled={disabled}
      />
      <div
        className={`flex items-center rounded-tl-none rounded-bl-none rounded pr-3 py-3 text-gray-600 bg-gray-100 border border-l-0 peer-focus:border-red-400 peer-focus:bg-white transition-colors duration-300 ${disabled ? "bg-gray-200" : ""
          } ${decorationClassName}`}
      >
        {decoration}
      </div>
    </div>
  );
}

const CustomInputField = forwardRef(
  (
    {
      name,
      value,
      label,
      onClick,
      disabled,
      inputClassName,
      icon = <BiCalendar size="1rem" />,
    },
    ref
  ) => (
    <button className="w-full" onClick={onClick} ref={ref} disabled={disabled}>
      <InputGroup6
        name={name}
        value={value}
        onChange={() => null}
        label={label}
        decoration={icon}
        disabled={disabled}
        inputClassName={inputClassName}
      />
    </button>
  )
);
function DatepickerPresentationGroup({ caption, children }) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-sm text-gray-700">{caption}</div>
      {children}
    </div>
  );
}
function DatePicker1Presentation({ setSelectedDate }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (date) => {
    setStartDate(date);
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-5 sm:p-10 w-full rounded-md">
      <DatepickerPresentationGroup caption="Calendar date picker">
        <DatePicker1
          selected={startDate}
          onChange={handleChange}
          customInput={<CustomInputField name="name" label="Select date" />}
          startDate={startDate}
          popperPlacement="bottom"
        />
      </DatepickerPresentationGroup>
    </div>
  );
}


export { DatePicker1Presentation };
