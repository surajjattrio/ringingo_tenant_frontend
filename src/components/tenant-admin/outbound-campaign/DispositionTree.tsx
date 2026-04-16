import { Disclosure } from "@headlessui/react";

interface DispositionTreeProps {
  items: any;
  onSelect: any;
  selectedValue?: string;
}

const DispositionTree = (props: DispositionTreeProps) => {
  const { items, onSelect, selectedValue } = props;

  return (
    <ul className="pl-2 space-y-1">
      {items.map((item: any) => (
        <li key={item.disposition_uuid || item.value}>
          {item.has_children ? (
            //  When item has children: text + arrow both toggle Disclosure
            <Disclosure>
              {({ open }) => (
                <>
                  <div className="">
                    <Disclosure.Button className="flex items-center w-full px-2 py-1 hover:bg-gray-100">
                      <span className="mr-2 text-xs">
                        {open ? "▼" : "▶"}
                      </span>

                      <span className="flex-1 text-left">
                        {item.label || item.name}
                      </span>
                    </Disclosure.Button>
                  </div>
                  <Disclosure.Panel>
                    {/* Indent nested list */}
                    <div className="pl-4 mt-1 border-l border-gray-200">
                      <DispositionTree
                        items={item.children || []}
                        onSelect={onSelect}
                      />
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

          ) : (
            <div
              className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <input
                type="checkbox"
                checked={selectedValue === (item.value || item.disposition_uuid)}
                onChange={() => onSelect(item)}
                className="mr-2"
              />
              <span className="flex-1">
                {item.label || item.name}
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default DispositionTree;




