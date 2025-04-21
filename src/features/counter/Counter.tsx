import {useSelector, useDispatch} from 'react-redux'
import {decrement, increment} from './counterSlice'
import {RootState} from "../../store.ts";
import {Button, Flex, Typography} from "antd";

export function Counter() {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <>
            <Flex align={"center"} gap={20}>
                <Button
                    type="default"
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    Decrement
                </Button>
                <Typography.Title>{count}</Typography.Title>
                <Button
                    type="primary"
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </Button>

            </Flex>
        </>

    )
}