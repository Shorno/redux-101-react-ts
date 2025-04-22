import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {useState} from "react";
import {
    Button,
    Checkbox, Divider,
    Flex,
    Input,
    notification,
    Popconfirm, Select,
    Space,
    Table,
    TableColumnsType,
    Tag,
    Typography
} from "antd";
import {addTodo, deleteTodo, editTodo, TodoState, toggleTodo} from "./todoSlice.ts";
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {addCategory, removeCategory} from "../category/categorySlice.ts";

export default function Todo() {
    const [title, setTitle] = useState<string>("")
    const [editedTitle, setEditedTitle] = useState<string>("")
    const todos = useSelector((state: RootState) => state.todo)
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const categories = useSelector((state: RootState) => state.category)
    const [newCategoryName, setNewCategoryName] = useState("")

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


    const handleAddNewCategory = (name: string) => {
        if (name === "") {
            notification.info({message: "Category name is empty!"})
            return
        }
        dispatch(addCategory(name))
        setNewCategoryName("")
    }
    const handleDeleteCategory = (id: string) => {
        dispatch(removeCategory(id))
    };

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
                       onPressEnter={handleAddTodo}
                       size={"large"}
                />
                <Button
                    onClick={handleAddTodo}
                    type="primary"
                    size={"large"}
                    icon={<PlusOutlined/>}
                >
                    Add todo
                </Button>
            </Space.Compact>
            <Flex className={"mt-10!"}>
                <Select
                    placeholder={"TODO category"}
                    size={"large"}
                    className={"w-56"}
                    options={categories}
                    fieldNames={{value: 'id'}}
                    optionRender={(option) => (
                        <>
                            <Flex justify={"space-between"}>
                                {option.data.label}
                                <DeleteOutlined onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(option.data.id);
                                }}/>
                            </Flex>
                        </>

                    )}
                    dropdownRender={(categories) => (
                        <>
                            {categories}
                                <Divider className={"my-2!"}/>
                                <Flex gap={10} className={"p-1!"}>
                                    <Input placeholder={"Category name"}
                                           value={newCategoryName}
                                           onPressEnter={() => handleAddNewCategory(newCategoryName)}
                                           onChange={(event) => setNewCategoryName(event.target.value)}/>
                                    <Button
                                        icon={<PlusOutlined/>}
                                        onClick={() => handleAddNewCategory(newCategoryName)}
                                    >
                                        Add
                                    </Button>
                                </Flex>
                        </>
                    )}


                />
            </Flex>

            <Flex className={"pt-32!"}>
                <Table bordered dataSource={todos} columns={columns} className={"w-80 sm:w-96"} pagination={false}/>
            </Flex>
        </>
    )
}