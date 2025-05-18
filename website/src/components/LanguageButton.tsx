import { useState } from "react";
import { Button, Combobox, useCombobox, Text, Box } from "@mantine/core";
import "flag-icons/css/flag-icons.min.css";

const languages = ["en", "ar"];

export default function LanguageButton() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = languages.map((item) => (
    <Combobox.Option value={item} key={item}>
      <Box className="flex gap-2 items-center">
        <Box className="rounded-full ">
          {item == "ar" && <div className="fi fi-dz" />}
          {item == "en" && <div className="fi fi-gb" />}
        </Box>
        <div>{item}</div>
      </Box>
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        store={combobox}
        width={150}
        position="bottom-end"
        onOptionSubmit={(val) => {
          setSelectedItem(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <button
            className="hover:bg-gray-200 p-2 px-2.5 rounded-full cursor-pointer"
            onClick={() => combobox.toggleDropdown()}
          >
            {selectedItem == "ar" ? (
              <span className="fi fi-dz " />
            ) : (
              <span className="fi fi-gb" />
            )}
          </button>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
