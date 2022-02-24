import React from "react";
import {useState} from "react";

export const SearchPanel = ({users, param, setParam}) => {

    console.log('SearchPanel')
    return <form action="">
        <input value={param.name} onChange={(evt)=>{
            setParam({
                ...param,
                name: evt.target.value
            })
            // setParam(Object.assign({}, param, {name:evt.target.value}))
        }
        }/>
        <select value={param.personId} onChange={(evt)=>{
            setParam({
                ...param,
                personId: evt.target.value
            })
            }
        }>
            <option value=''>负责人</option>
            {
                users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
            }
        </select>
    </form>
}