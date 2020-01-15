import React, {
  memo, useState, useEffect, useCallback,
} from 'react';
import {
  View, ViewStyle,
} from 'react-native';
import _ from 'lodash';
import BbkComponentCarFilterModal,
{ FilterFooter, IBbkComponentCarFilterModalFooter } from '@ctrip/bbk-component-car-filter-modal';
import BbkComponentFilterList, { filterUtil } from '@ctrip/bbk-component-filter-list';
import { FilterType, FilterCalculaterType } from '@ctrip/bbk-logic';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';
import { ClickKey, FilterBarType } from '../../../Constants/Index';
import { CarLog } from '../../../Util/Index';

const { SelectMenuType } = BbkSelectMenu;
const { usePriceInfo, getPriceText } = filterUtil;

interface IFilterInner extends IBbkComponentCarFilterModalFooter {
  type: string;
  filterData: Array<Object>;
  currency: string;
  priceStep?: number;
  onHide?: (animation?: any) => void;
  updateSelectedFilter?: (data: any) => void;
  updateTempFilter?: (data: any, handleType: string, type: string, isPriceLabel: boolean) => void;
  updateTempPrice?: (data: any, handleType: string) => void;
}

interface IFilterType extends FilterType {
  filterLabels: any;
}

export interface IFilterAndSort extends IFilterInner {
  visible: boolean;
  filterCalculater: FilterCalculaterType;
  selectedFilters: IFilterType;
  allFilters: any;
  priceRange: {minRange: number, maxRange: number};
  disableNavigatorDragBack: () => void;
  enableNavigatorDragBack: () => void;
  setActiveFilterBarCode: (data: any) => void;
  getFilterCalculate?: (data: any) => any;
  setFilterModalIsShow: (data: any) => any;
  style?: ViewStyle
}

const initFilterData = (filterType, tempFilterData) => {
  let filterData = [];
  const type = filterType
    && filterType.indexOf('Vendor_0') > -1 ? FilterBarType.Supplier : filterType;
  switch (type) {
    case FilterBarType.Sort:
      filterData = tempFilterData;
      break;
    case FilterBarType.Supplier:
    case FilterBarType.Filters:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          filterData.push(item.filterGroups[0]);
        }
      });
      break;
    case FilterBarType.Seats:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          item.filterGroups.forEach((group) => {
            if (group && group.filterItems.length > 0) {
              filterData = filterData.concat(group.filterItems);
            }
          });
        }
      });
      break;
    default:
      break;
  }
  return filterData;
};

const isEqualInner = (prevProps, nextProps) => nextProps.type === ''
  || nextProps.type === undefined;

const RenderInner: React.FC<IFilterInner> = memo(({
  type, filterData, ModelsNumber, PricesNumber, currency, priceStep, updateSelectedFilter,
  updateTempFilter, updateTempPrice, onHide, onDetermine, onClear,
}: IFilterInner) => (
  <View>
    {!!type && type === FilterBarType.Sort && (
    <BbkComponentSelectMenu
      filterData={initFilterData(type, filterData)}
      type={SelectMenuType.Single}
      onToggle={(label) => {
        updateSelectedFilter({ sortFilter: label.code });
        CarLog.LogCode({ enName: ClickKey.C_LIST_SAVED_SORT.KEY, sortFilter: label.code });
        onHide();
      }}
    />
    )}

    {!!type && (type === FilterBarType.Supplier
        || (type && type.indexOf('Vendor_') > -1)) && ( // 供应商筛选项code为Vendor_
          <>
            <BbkComponentFilterList
              filterGroups={initFilterData(type, filterData)}
              changeTempFilterData={(label, handleType) => {
                updateTempFilter(label, handleType, type, false);
              }}
            />
            <FilterFooter
              ModelsNumber={ModelsNumber}
              PricesNumber={PricesNumber}
              onDetermine={onDetermine}
              onClear={onClear}
            />
          </>
    )}

    {!!type && type === FilterBarType.Seats && (
    <>
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Multiple}
        onToggle={(label, handleType) => {
          updateTempFilter(label, handleType, type, false);
        }}
      />
      <FilterFooter
        ModelsNumber={ModelsNumber}
        PricesNumber={PricesNumber}
        onDetermine={onDetermine}
        onClear={onClear}
      />
    </>
    )}

    {!!type && type === FilterBarType.Filters && (
    <>
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        currency={currency}
        priceStep={priceStep}
        changeTempFilterData={(label, handleType, isPriceLabel) => {
          updateTempFilter(label, handleType, type, isPriceLabel);
        }}
        updateStartPrice={(startPrice) => {
          updateTempPrice(startPrice, 'start');
        }}
        updateEndPrice={(endPrice) => {
          updateTempPrice(endPrice, 'end');
        }}
      />
      <FilterFooter
        ModelsNumber={ModelsNumber}
        PricesNumber={PricesNumber}
        onDetermine={onDetermine}
        onClear={onClear}
      />
    </>
    )}
  </View>
), isEqualInner);

const FilterAndSortModal: React.FC<IFilterAndSort> = memo(({
  visible,
  filterData,
  selectedFilters,
  allFilters = [],
  filterCalculater = { vehiclesCount: 0, pricesCount: 0 },
  priceRange,
  type,
  currency,
  priceStep,
  disableNavigatorDragBack,
  enableNavigatorDragBack,
  updateSelectedFilter,
  setActiveFilterBarCode,
  getFilterCalculate,
  setFilterModalIsShow,
  style,
}: IFilterAndSort) => {
  const animationConfig = null;
  const [tempFilterLabel, setTempFilterLabel] = useState([]);
  const [tempPrice, setTempPrice] = useState({ min: 0, max: 0 });
  // eslint-disable-next-line prefer-const
  let [filterDataState, setFilterDataState] = useState([]);
  const [count, setCount] = useState(filterCalculater);
  const [toggleClearFilter, setToggleClearFilter] = useState(false);
  const {
    startPrice,
    endPrice,
    startPriceStr,
    endPriceStr,
    formatCurrency,
    minRange,
    maxRange,
    maxRangeStr,
  } = usePriceInfo({
    tempPrice, priceRange, priceStep, currency,
  });

  filterDataState = filterData;

  useEffect(() => {
    setCount(filterCalculater);
  }, [filterCalculater]);

  useEffect(() => {
    const initFilterCode = allFilters.map(item => ({
      type: item.type,
      selectedLabelList:
        selectedFilters.filterLabels.filter(label => item.codeList.includes(label.code)) || [],
    }));

    setTempFilterLabel(initFilterCode);
  }, [selectedFilters.filterLabels, allFilters]);

  useEffect(() => {
    setTempPrice(
      selectedFilters.priceFilter
        && selectedFilters.priceFilter.length > 0
        ? selectedFilters.priceFilter[0] : { min: 0, max: 0 });
  }, [selectedFilters.priceFilter]);

  useEffect(() => {
    if (!visible) {
      // setFilterDataState([]);
      // setCount({ vehiclesCount: 0, pricesCount: 0 });
      enableNavigatorDragBack();
    } else {
      disableNavigatorDragBack();
    }
  }, [setActiveFilterBarCode, disableNavigatorDragBack, visible, enableNavigatorDragBack]);

  const onHide = useCallback(() => {
    setActiveFilterBarCode('');
    setFilterModalIsShow({ visible: false });
  }, [setActiveFilterBarCode, setFilterModalIsShow]);

  const setSelectedFilters = useCallback((labelVal, priceVal) => {
    let savedFilter = [];
    let bitsFilter = [];
    let price = priceVal;

    labelVal.forEach((temp) => {
      savedFilter = savedFilter.concat(temp.selectedLabelList);
    });
    const savedBitsFilter = savedFilter.filter(
      filter => filter && filter.code && filter.code.indexOf('Price') === -1);
    bitsFilter = savedBitsFilter.map(filter => filter && filter.code);

    if (price && price.min === 0 && price.max === 0) {
      price = {};
    }

    return {
      sortFilter: selectedFilters.sortFilter,
      bitsFilter,
      filterLabels: savedFilter,
      priceFilter: JSON.stringify(price) === '{}' ? [] : [price],
    };
  }, [selectedFilters.sortFilter]);

  const setFilterLabel = useCallback((label, handleType, typeName, isPriceLabel) => {
    const filterLabel = tempFilterLabel.map((item) => {
      if (item.type === typeName) {
        if (handleType === 'add') {
          if (isPriceLabel) {
            const deletePriceLabel = item.selectedLabelList.find(
              v => v.code && v.code.indexOf('Price') > -1,
            );
            _.pull(item.selectedLabelList, deletePriceLabel);
          }
          item.selectedLabelList.push({
            code: isPriceLabel ? label.itemCode : label.code,
            name: label.name,
          });
        } else {
          const deleteLabel = item.selectedLabelList.find(v => v && v.code === label.code);

          _.pull(item.selectedLabelList, deleteLabel);
        }
      }

      return item;
    });

    return filterLabel;
  }, [tempFilterLabel]);

  const setPriceLabel = useCallback(() => {
    const priceText = getPriceText({
      startPrice,
      endPrice,
      startPriceStr,
      endPriceStr,
      maxRange,
      maxRangeStr,
      currency: formatCurrency,
    });

    const handleType = startPrice === minRange && endPrice === maxRange ? 'delete' : 'add';
    const label = {
      name: priceText,
      itemCode: `Price_${priceText}`,
    };

    const filterLabel = setFilterLabel(label, handleType, FilterBarType.Filters, true);

    return filterLabel;
  }, [endPrice, endPriceStr, formatCurrency, maxRange, maxRangeStr,
    minRange, setFilterLabel, startPrice, startPriceStr]);

  const updateFilterCalculate = useCallback((labelVal, priceVal) => {
    const temp = setSelectedFilters(labelVal, priceVal);
    setCount(getFilterCalculate(temp));
  }, [getFilterCalculate, setSelectedFilters]);

  const updateTempFilter = useCallback((label, handleType, typeName, isPriceLabel) => {
    const temp = setFilterLabel(label, handleType, typeName, isPriceLabel);

    setTempFilterLabel(temp);
    updateFilterCalculate(temp, tempPrice);
  }, [setFilterLabel, updateFilterCalculate, tempPrice]);

  const updateTempPrice = useCallback((price, priceType) => {
    const temp: any = tempPrice;

    if (priceType === 'start') {
      temp.min = price;
    } else {
      temp.max = price;
    }

    if (!temp.min) temp.min = 0;
    if (!temp.max) temp.max = 0;
    setTempPrice(temp);
    updateFilterCalculate(tempFilterLabel, temp);
  }, [updateFilterCalculate, tempFilterLabel, tempPrice]);

  const onSaveFilter = useCallback(() => {
    let filterLabel = tempFilterLabel;
    if (tempPrice && !(tempPrice.min === 0 && tempPrice.max === 0)) {
      filterLabel = setPriceLabel();
    }
    const temp = setSelectedFilters(filterLabel, tempPrice);

    updateFilterCalculate(filterLabel, tempPrice);
    updateSelectedFilter(temp);
    onHide();
    CarLog.LogCode({ enName: ClickKey.C_LIST_SAVED_FILTERS.KEY, selectedFilters: temp });
  }, [tempFilterLabel, tempPrice, setSelectedFilters,
    updateFilterCalculate, updateSelectedFilter, onHide, setPriceLabel]);

  const onClearFilter = useCallback(() => {
    const tempCode = tempFilterLabel.map((item) => {
      const newItem = item;
      if (newItem.type === type) {
        newItem.selectedLabelList = [];
      }

      return newItem;
    });

    const tempFilterDataState = filterDataState.map((menu) => {
      const newMenu = menu;
      newMenu.isSelected = false;
      if (newMenu.filterGroups && newMenu.filterGroups.length > 0) {
        newMenu.filterGroups.forEach((group) => {
          const newGroup = group;
          newGroup.isSelected = false;
          if (newGroup.code === 'Price') {
            newGroup.minPrice = newGroup.minRange;
            newGroup.maxPrice = newGroup.maxRange;
          }
          if (newGroup && newGroup.filterItems.length > 0) {
            newGroup.filterItems.forEach((item) => {
              const newItem = item;
              newItem.isSelected = false;
            });
          }
          newGroup.toggleClearFilter = !toggleClearFilter;
          setToggleClearFilter(!toggleClearFilter);
        });
      }

      return newMenu;
    });

    setTempPrice({ min: 0, max: 0 });
    setFilterDataState(tempFilterDataState);
    setTempFilterLabel(tempCode);
    updateFilterCalculate(tempCode, {});
  }, [filterDataState, updateFilterCalculate, tempFilterLabel, toggleClearFilter, type]);

  if (visible && filterDataState && filterDataState.length === 0) return null;

  // @ts-ignore
  // logTime('【modal】 FilterAndSortModal render', JSON.stringify(count), type);
  return (
    <BbkComponentCarFilterModal
      // @ts-ignore
      modalVisible={visible}
      // @ts-ignore
      animationConfig={animationConfig}
      // @ts-ignore
      onHide={onHide}
      style={style}
    >
      <RenderInner
        type={type}
        filterData={filterDataState}
        ModelsNumber={count.vehiclesCount}
        PricesNumber={count.pricesCount}
        onDetermine={onSaveFilter}
        onClear={onClearFilter}
        currency={currency}
        priceStep={priceStep}
        updateSelectedFilter={updateSelectedFilter}
        updateTempFilter={updateTempFilter}
        updateTempPrice={updateTempPrice}
        onHide={onHide}
      />
    </BbkComponentCarFilterModal>
  );
}, (prevProps, nextProps) => prevProps.visible === nextProps.visible && !nextProps.visible);

export default FilterAndSortModal;
