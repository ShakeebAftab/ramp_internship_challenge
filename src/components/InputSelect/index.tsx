import { useCallback, useState, useRef, useEffect } from "react"
import Downshift from "downshift"
import classNames from "classnames"
import { InputSelectOnChange, InputSelectProps } from "./types"

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
}: InputSelectProps<TItem>) {
  const [selectedValue, setSelectedValue] = useState<TItem | null>(defaultValue ?? null)
  const [isOpen, setIsOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem) => {
      if (selectedItem === null) {
        return
      }
      consumerOnChange(selectedItem)
      setSelectedValue(selectedItem)
    },
    [consumerOnChange]
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function adjustDropdownPosition() {
      if (dropdownRef.current && toggleButtonRef.current) {
        const { bottom, left } = toggleButtonRef.current.getBoundingClientRect()
        dropdownRef.current.style.top = `${bottom}px`
        dropdownRef.current.style.left = `${left}px`
      }
    }

    // Adjust position on open and on resize/scroll events
    adjustDropdownPosition()
    window.addEventListener("scroll", adjustDropdownPosition, true)
    window.addEventListener("resize", adjustDropdownPosition)

    return () => {
      window.removeEventListener("scroll", adjustDropdownPosition, true)
      window.removeEventListener("resize", adjustDropdownPosition)
    }
  }, [isOpen])

  return (
    <Downshift<TItem>
      onChange={onChange}
      selectedItem={selectedValue}
      isOpen={isOpen}
      onOuterClick={() => setIsOpen(false)}
      itemToString={(item) => (item ? parseItem(item).label : "")}
    >
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
      }) => {
        const toggleProps = getToggleButtonProps({
          ref: toggleButtonRef,
          onClick: () => setIsOpen((prevIsOpen) => !prevIsOpen),
        })

        return (
          <div className="RampInputSelect--root">
            <label className="RampText--s RampText--hushed" {...getLabelProps()}>
              {label}
            </label>
            <div className="RampBreak--xs" />
            <button
              {...toggleProps}
              className="RampInputSelect--input"
              style={{ width: "100%", textAlign: "left", background: "#fff" }}
            >
              {selectedItem ? parseItem(selectedItem).label : ""}
            </button>
            <div
              {...getMenuProps({
                ref: dropdownRef,
                className: classNames("RampInputSelect--dropdown-container", {
                  "RampInputSelect--dropdown-container-opened": isOpen,
                }),
              })}
            >
              {isOpen ? renderItems() : null}
            </div>
          </div>
        )

        function renderItems() {
          if (isLoading) {
            return <div className="RampInputSelect--dropdown-item">{loadingLabel}...</div>
          }

          if (items.length === 0) {
            return <div className="RampInputSelect--dropdown-item">No items</div>
          }

          return items.map((item, index) => {
            const parsedItem = parseItem(item)
            return (
              <div
                key={parsedItem.value}
                {...getItemProps({
                  key: parsedItem.value,
                  index,
                  item,
                  className: classNames("RampInputSelect--dropdown-item", {
                    "RampInputSelect--dropdown-item-highlighted": highlightedIndex === index,
                    "RampInputSelect--dropdown-item-selected":
                      selectedItem && parseItem(selectedItem).value === parsedItem.value,
                  }),
                })}
              >
                {parsedItem.label}
              </div>
            )
          })
        }
      }}
    </Downshift>
  )
}
