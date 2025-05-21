import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Pagination } from "react-bootstrap"; 
import "../styles/Style.css"

const Pages = observer(() => {
    const { pattern } = useContext(Context)
    const pageCount = Math.ceil(pattern.totalCount / pattern.limit)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }

    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    style={{borderRadius: '15%'}}
                    key={page}
                    active={pattern.page === page}
                    onClick={() => pattern.setPage(page)}
                    className={`custom-active`}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default Pages;