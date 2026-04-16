import React from "react";
import Input from "./Input";
import ModernInput from "./ModernInput";

const InputShowcase = () => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Modern Input Design Showcase
        </h1>
        <p className="text-gray-600 mb-4">
          Here are various input design options that can be used across the
          application for a more visually appealing user interface.
        </p>
      </div>

      {/* Enhanced Default Input */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-700">
          Enhanced Default Input
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          The upgraded version of the standard input component
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="default-input"
            label="Default Input"
            placeholder="Enter some text"
            icon="User"
          />
          <Input
            name="default-input-error"
            label="With Error State"
            placeholder="Enter some text"
            icon="User"
            touched={{ "default-input-error": true }}
            errors={{ "default-input-error": "This field is required" }}
          />
        </div>
      </div>

      {/* Modern Input Variants */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-700">
          Modern Input Variants
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Different input styling variations for modern interfaces
        </p>

        {/* Default */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Default Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              name="modern-default"
              label="Default Style"
              placeholder="Enter some text"
              icon="User"
              rightIcon="CheckMarkWhite"
            />
            <ModernInput
              name="modern-default-error"
              label="With Error State"
              placeholder="Enter some text"
              icon="User"
              touched={{ "modern-default-error": true }}
              errors={{ "modern-default-error": "This field is required" }}
            />
          </div>
        </div>

        {/* Filled */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Filled Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              name="modern-filled"
              label="Filled Style"
              placeholder="Enter some text"
              icon="MailFill"
              variant="filled"
            />
            <ModernInput
              name="modern-filled-error"
              label="With Error State"
              placeholder="Enter some text"
              icon="MailFill"
              variant="filled"
              touched={{ "modern-filled-error": true }}
              errors={{ "modern-filled-error": "This field is required" }}
            />
          </div>
        </div>

        {/* Outlined */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Outlined Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              name="modern-outlined"
              label="Outlined Style"
              placeholder="Enter some text"
              icon="MicroPhone"
              variant="outlined"
            />
            <ModernInput
              name="modern-outlined-error"
              label="With Error State"
              placeholder="Enter some text"
              icon="MicroPhone"
              variant="outlined"
              touched={{ "modern-outlined-error": true }}
              errors={{ "modern-outlined-error": "This field is required" }}
            />
          </div>
        </div>

        {/* Underlined */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Underlined Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              name="modern-underlined"
              label="Underlined Style"
              placeholder="Enter some text"
              icon="Calendar"
              variant="underlined"
            />
            <ModernInput
              name="modern-underlined-error"
              label="With Error State"
              placeholder="Enter some text"
              icon="Calendar"
              variant="underlined"
              touched={{ "modern-underlined-error": true }}
              errors={{ "modern-underlined-error": "This field is required" }}
            />
          </div>
        </div>

        {/* Floating Label */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Floating Label Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              name="modern-floating"
              label="Email Address"
              icon="Email"
              variant="floating"
              value="example@mail.com"
            />
            <ModernInput
              name="modern-floating-error"
              label="Email Address"
              icon="Email"
              variant="floating"
              touched={{ "modern-floating-error": true }}
              errors={{ "modern-floating-error": "Please enter a valid email" }}
            />
          </div>
        </div>
      </div>

      {/* Size Variations */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-700">Size Variations</h2>
        <p className="text-sm text-gray-500 mb-3">
          Different size options for inputs
        </p>
        <div className="grid grid-cols-1 gap-6">
          <ModernInput
            name="small-input"
            label="Small Input"
            placeholder="Small size"
            size="sm"
            icon="User"
          />
          <ModernInput
            name="medium-input"
            label="Medium Input (Default)"
            placeholder="Medium size"
            size="md"
            icon="User"
          />
          <ModernInput
            name="large-input"
            label="Large Input"
            placeholder="Large size"
            size="lg"
            icon="User"
          />
        </div>
      </div>

      {/* With Icons & Interactions */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-700">
          Icon Placement & Interactions
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Inputs with various icon placements and interactive elements
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput
            name="left-icon"
            label="Left Icon Only"
            placeholder="With left icon"
            icon="SearchGray"
          />
          <ModernInput
            name="right-icon"
            label="Right Icon Only"
            placeholder="With right icon"
            rightIcon="Eye"
          />
          <ModernInput
            name="both-icons"
            label="Both Icons"
            placeholder="With both icons"
            icon="LockFill"
            rightIcon="LockFill"
          />
          <ModernInput
            name="disabled-input"
            label="Disabled State"
            placeholder="Cannot be edited"
            icon="LockFill"
            disabled={true}
            value="Disabled input"
          />
        </div>
      </div>
    </div>
  );
};

export default InputShowcase;
