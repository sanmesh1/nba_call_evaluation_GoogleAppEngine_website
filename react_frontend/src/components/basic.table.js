// src/components/sorting.table.js
import React from "react";

import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
	onChangeTextboxFunc
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
            <input
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
					console.log("GlobalFilter")
					console.log(typeof onChangeTextboxFunc);
					onChangeTextboxFunc(e);
                }}
                placeholder={'Enter Player Name...'}
				style={{ width: '500px', height: '30px' }}
            />
        </span>
    )
}

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <input
            className="form-control"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={'Search ${count} records...'}
        />
    )
}

function Table({ clickOnRowFunc, columns, data, onChangeFunc, stateOfDropdown, onChangeTextboxFunc, submitButtonEvent }) {
    // Use the state and functions returned from useTable to build your UI
    const defaultColumn = React.useMemo(
        () => ({
            // Default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

	
	
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
		////////
		page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
		preGlobalFilteredRows,
        setGlobalFilter,
		state: { pageIndex, pageSize, globalFilter},
		////////
    } = useTable(
        {
            columns,
            data,
			defaultColumn,
			initialState: { pageIndex: 0, pageSize: 5 },
        },
		useFilters,
        useGlobalFilter,
		useSortBy,
		usePagination,
    )

    // Render the UI for your table
    return (
        <div>
		{/*
			<pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        1
                    )}
                </code>
            </pre>
		*/}
		    <select className="teamOrPlayer" value={stateOfDropdown} onChange={onChangeFunc}>
				<option value="Player">Player</option>
				<option value="Team">Team</option>
			</select>
			<GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
				onChangeTextboxFunc = {onChangeTextboxFunc}
            />
			<button className="callApi" onClick={submitButtonEvent}> 
				Submit
			</button>
            <table className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
									{/*<div>{column.canFilter ? column.render('Filter') : null}</div> */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} onClick={() => clickOnRowFunc(row.original)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
            <br />
            <div>Showing the first 20 results of {rows.length} rows</div>
            <ul className="pagination">
                <li className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    <a className="page-link">First</a>
                </li>
                <li className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <a className="page-link">{'<'}</a>
                </li>
                <li className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
                    <a className="page-link">{'>'}</a>
                </li>
                <li className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <a className="page-link">Last</a>
                </li>
                <li>
                    <a className="page-link">
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </a>
                </li>
                <li>
                    <a className="page-link">
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px', height: '20px' }}
                        />
                    </a>
                </li>{' '}
                <select
                    className="form-control"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                    style={{ width: '120px', height: '38px' }}
                >
                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </ul>
        </div >
    )
}

function SortingTableComponent({ data, onChangeFunc, stateOfDropdown, onChangeTextboxFunc, submitButtonEvent, clickOnRowFunc }) {
    // data.forEach(function (element, index, array) {
		// element.pointsLostByReferee = (element.num_errors_against - element.num_errors_in_favor) * 2;
		// if (element.PlayerName.split(' ').length ==  1 || element.PlayerName.match(/^ *$/) !== null){
			// array.splice(index, 1);
		// }
	// });
	const columns = React.useMemo(
        () => [
            {
                Header: 'Top Players Disadvantaged by Referees',
                columns: [
                    {
                        Header: 'Player',
                        accessor: 'PlayerName',
                    },
					{
                        Header: '# Errors Against',
                        accessor: 'num_errors_against',
                    },
                    {
                        Header: '% Errors Against',
                        accessor: 'percent_errors_against',
                    },
                    {
                        Header: 'Net Points Lost To Referees',
                        accessor: 'pointsLostByReferee',
                    },
                ],
            },
        ],
        []
    )

    // console.log(JSON.stringify(data));
	console.log("SortingTableComponent")
	console.log(typeof onChangeFunc)
	console.log(typeof onChangeTextboxFunc)

    return (
<Table clickOnRowFunc={clickOnRowFunc} columns={columns} data={data} onChangeTextboxFunc={onChangeTextboxFunc} onChangeFunc={onChangeFunc} stateOfDropdown={stateOfDropdown} submitButtonEvent={submitButtonEvent}/>
    )
}

export default SortingTableComponent;