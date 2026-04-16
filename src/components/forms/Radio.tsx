// components/Radio.tsx
import React from "react";
import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";
import styled from "styled-components";

interface RadioProps {
  name: string;
  options: OptionTypes[];
  selectedValue?: string;
  onChange: any;
  className?: any;
  touched?: any;
  errors?: any;
  onBlur?: any;
  isShowLabel?: boolean;
  label?: string;
  value: string;
}

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioLabel = styled.div`
  text-xs: font-semibold;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const RadioOptionLabel = styled.label`
  color: rgba(0, 0, 0, 0.75);
  display: block;
  position: relative;
  padding-left: 20px;
  line-height: 20px;
  margin-bottom: 12px;
  margin-left: 10px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 12px;
  line-height: 13px;

  &:first-child {
    margin-left: 0px;
  }
`;

const RadioCustomSelect = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 13px;
  width: 13px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.25);
  transition: all 0.3s;
`;

const RadioInput = styled.input`
  position: absolute;
  cursor: pointer;
  display: none;

  &:focus {
    border-color: #66a286;
  }

  &:checked ~ span {
    background-color: rgba(0, 0, 0, 0);
    border-color: #66a286;
  }
  &:checked ~ span:after {
    display: block;
    content: "";
    position: absolute;
    transform: translateY(-52%);
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #66a286;
  }
`;

const Radio = (props: RadioProps) => {
  const {
    className = "",
    isShowLabel = true,
    label,
    name,
    selectedValue,
    options = [],
    value,
    touched,
    errors,
    onChange,
    onBlur,
  } = props;

  return (
    <RadioContainer className={className}>
      {isShowLabel && (
        <div className="text-xs font-semibold pb-2 flex items-center">
          <label htmlFor={name}>{label ? label : name}</label>
        </div>
      )}
      <RadioGroup>
        {options.map((option, index) => (
          <RadioOptionLabel htmlFor={index.toString()} key={option.value}>
            {option.label}
            <RadioInput
              id={index.toString()}
              type="radio"
              name={name}
              checked={option.value === value}
              value={option.value}
              onChange={onChange}
              onBlur={onBlur}
            />
            <RadioCustomSelect></RadioCustomSelect>
          </RadioOptionLabel>
        ))}
      </RadioGroup>
    </RadioContainer>
  );
};

export default Radio;
