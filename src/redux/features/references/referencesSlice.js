import { dbAPI } from "@/lib/dbAPI";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const DATA_TEMPLATE_OBJECT = {
    name: '',
    company: '',
    phone: '',
    email: ''
}
const referencesSlice = createSlice({
    name: 'references',
    initialState: {
        data: [],
        __serv: { isSwitchChecked: false },
        status: 'idle',
        error: ''
    },
    reducers: {
        toggleReferencesSwitch: (state) => {
            state.__serv.isSwitchChecked = !state.__serv.isSwitchChecked;
        },
        addReferencesItem: (state) => {
            state.data = [...state.data, DATA_TEMPLATE_OBJECT]
        },
        removeReferencesItem: (state, action) => {
            state.data.splice(action.payload, 1);
            if (state.data.length < 1) {
                state.data = []
            }
        },
        inputReferencesUpdate: (state, action) => {
            state.data[action.payload.arrayIndex][action.payload.inputName] = action.payload.value;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getReferences.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getReferences.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getReferences.fulfilled, (state, action) => {
                state.status = 'ready';
                if (action.payload) {
                    if (action.payload.data) {
                        state.data = action.payload.data;
                    }
                    if (action.payload.__serv) {
                        state.__serv = { ...action.payload.__serv }
                    }
                }
            })
    }
})

export default referencesSlice.reducer;
export const { addReferencesItem, removeReferencesItem, toggleReferencesSwitch, inputReferencesUpdate } = referencesSlice.actions;

export const getReferences = createAsyncThunk('references/getReferences', async (obj) => {
    let resp = await dbAPI.getSectionData('references', obj.userId, obj.accessToken);
    if (resp) {
        return resp;
    } else {
        return null
    }
})