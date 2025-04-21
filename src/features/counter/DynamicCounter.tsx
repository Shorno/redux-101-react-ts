import {Button, Flex, InputNumber, Space, Typography} from "antd";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {dynamicDecrement, dynamicIncrement} from "./dynamicCounterSlice.tsx";

export default function DynamicCounter() {
    const [increment, setIncrement] = useState<number>(0)
    const [decrement, setDecrement] = useState<number>(0)
    const number = useSelector((state: RootState) => state.dynamicCounter.value)
    const dispatch = useDispatch();

    return (
        <Flex gap={20} vertical align={"center"} justify={"center"}>
            <Space.Compact>
                <InputNumber
                    size={"large"}
                    value={increment}
                    type={"number"}
                    onChange={(value) => setIncrement(value || 0)}
                />
                <Button
                    size={"large"}
                    type="primary"
                    onClick={() => dispatch(dynamicIncrement(increment))}
                >
                    Increment
                </Button>
            </Space.Compact>
            <Typography.Title>{number}</Typography.Title>
            <Space.Compact>
                <InputNumber
                    size={"large"}
                    value={decrement}
                    type={"number"}
                    onChange={(value) => setDecrement(value || 0)}
                />
                <Button
                    size={"large"}
                    className={"bg-red-400!"}
                    type="primary"
                    onClick={() => dispatch(dynamicDecrement(decrement))}
                >
                    Decrement
                </Button>
            </Space.Compact>
        </Flex>
    )
}