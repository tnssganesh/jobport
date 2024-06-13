import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {renderProfile} = props
  const renderRatingsFiltersList = () => {
    const {salaryRangesList} = props
    const ratingsList = salaryRangesList
    // console.log(ratingsList)
    return ratingsList.map(rating => {
      const {changeRating, activeRatingId} = props
      const onClickRatingItem = () => changeRating(rating.salaryRangeId)

      const ratingClassName =
        activeRatingId === rating.salaryRangeId
          ? `and-up active-rating`
          : `and-up`

      return (
        <li
          className="rating-item"
          key={rating.salaryRangeId}
          onClick={onClickRatingItem}
        >
          <input key={rating.label} id={rating.salaryRangeId} type="radio" />
          <label htmlFor={rating.salaryRangeId} className={ratingClassName}>
            {rating.label}
          </label>
        </li>
      )
    })
  }

  const renderRatingsFilters = () => (
    <div>
      <h1 className="rating-heading">Salary Range</h1>
      <ul className="ratings-list">{renderRatingsFiltersList()}</ul>
    </div>
  )

  const renderCategoriesList = () => {
    const {employmentTypesList} = props
    const categoryOptions = employmentTypesList
    //   console.log(categoryOptions)
    return categoryOptions.map(category => {
      const {changeCategory, activeCategoryId} = props
      const onClickCategoryItem = () =>
        changeCategory(category.employmentTypeId)
      const isActive = category.employmentTypeId === activeCategoryId
      const categoryClassName = isActive
        ? `category-name active-category-name`
        : `category-name`

      return (
        <li
          className="category-item"
          key={category.employmentTypeId}
          onClick={onClickCategoryItem}
        >
          <input
            key={category.label}
            id={category.employmentTypeId}
            type="checkbox"
          />
          <label
            htmlFor={category.employmentTypeId}
            className={categoryClassName}
          >
            {category.label}
          </label>
        </li>
      )
    })
  }

  const renderProductCategories = () => (
    <>
      <h1 className="category-heading">Type of Employment</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
    </>
  )

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onSearchInput = event => {
    const {enterSearchInput} = props

    enterSearchInput()
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button
          onClick={onSearchInput}
          data-testid="searchButton"
          type="button"
        >
          <BsSearch className="search-icon" />.
        </button>
      </div>
    )
  }

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderProfile()}
      {renderSearchInput()}
      {renderProductCategories()}
      {renderRatingsFilters()}
      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
