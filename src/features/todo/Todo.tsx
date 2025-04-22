import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {useState} from "react";
import {
    Button,
    Checkbox,
    Flex,
    Input,
    notification,
    Popconfirm,
    Space,
    Table,
    TableColumnsType,
    Tag,
    Typography
} from "antd";
import {addTodo, deleteTodo, editTodo, TodoState, toggleTodo} from "./todoSlice.ts";
import {CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";

export default function Todo() {
    const [title, setTitle] = useState<string>("")
    const [editedTitle, setEditedTitle] = useState<string>("")
    const todos = useSelector((state: RootState) => state.todo)
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddTodo = () => {
        if (title === "") {
            notification.info({message: "Cannot add blank todo"})
            return
        }
        dispatch(addTodo(title))
        notification.success({message: "Todo added"})
        setTitle("")
    }

    const handleToggleTodo = (id: string, title: string, completed: boolean) => {
        dispatch(toggleTodo(id));

        const status = !completed ? "marked as completed" : "removed form completed";
        const tagColor = !completed ? "green" : "orange";

        notification.success({
            message: "Todo status updated",
            description: <span><Tag className={"m-0! capitalize"} color={tagColor}>{title}</Tag> is {status}</span>,
        });
    }

    const handleStartEditing = (id: string, currentTitle: string) => {
        setEditedTitle(currentTitle);
        setIsEditing(true);
        setEditingId(id);
    }

    const handleEditTitle = (id: string, title: string) => {
        if (title.trim() === "") {
            notification.info({message: "Todo title cannot be empty"});
            return;
        }
        dispatch(editTodo({id, title}));
        notification.success({message: "Todo updated"})
        setIsEditing(false);
        setEditingId(null);
    }

    const handleDeleteTodo = (id: string) => {
        dispatch(deleteTodo(id))
        notification.success({message: "Todo removed"})
    }
    const columns: TableColumnsType<TodoState> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (value, record) =>
                <Flex gap={10}>
                    <Checkbox
                        onClick={() => handleToggleTodo(record.id, record.title, record.completed)}
                        checked={record.completed}
                    />
                    {isEditing && editingId === record.id ?
                        <Input
                            value={editedTitle}
                            onChange={(event) => setEditedTitle(event.target.value)}
                            onPressEnter={() => handleEditTitle(record.id, editedTitle)}
                        />
                        :
                        <Typography.Text type={record.completed ? "secondary" : undefined}>{value}</Typography.Text>
                    }
                </Flex>

        },
        {
            title: "Action",
            width: "20%",
            align: "center",
            key: "actions",
            render: (_, record) => <Flex gap={10}>
                {editingId === record.id ?
                    <Flex gap={10}>
                        <Button icon={<SaveOutlined/>} onClick={() => handleEditTitle(record.id, editedTitle)}/>
                        <Button icon={<CloseOutlined/>} onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                        }}/>
                    </Flex>
                    :
                    <Flex gap={10}>
                        <Button icon={<EditOutlined/>} onClick={() => handleStartEditing(record.id, record.title)}/>
                        <Popconfirm
                            title="Delete the task"
                            description={`Are you sure to delete ${record.title} task?`}
                            onConfirm={() => handleDeleteTodo(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined/>}/>

                        </Popconfirm>
                    </Flex>
                }
            </Flex>
        }
    ]


    return (
        <>
            <Space.Compact className={"w-80 sm:w-96"}>
                <Input placeholder={"Enter todo title"} value={title}
                       onChange={(event) => setTitle(event.target.value)}
                       onPressEnter={handleAddTodo}/>
                <Button
                    onClick={handleAddTodo}
                    type="primary"
                >
                    Add todo
                </Button>
            </Space.Compact>
            <Flex className={"pt-32!"}>
                <Table bordered dataSource={todos} columns={columns} className={"w-80 sm:w-96"} pagination={false}/>
            </Flex>
        </>
    )
}