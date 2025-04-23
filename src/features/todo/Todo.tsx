import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {useState} from "react";
import {
    Button, Card,
    Checkbox, Divider,
    Flex,
    Input,
    notification,
    Popconfirm, Select, Space,
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
    const [category, setCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [isCompleted, setIsCompleted] = useState<undefined | boolean>(undefined)

    const handleAddTodo = () => {
        if (title === "") {
            notification.info({message: "Title is empty!"})
            return
        }
        dispatch(addTodo({title, category}))
        notification.success({message: "Todo added"})
        setTitle("")
    }

    const filterTodos = (categoryFilter: string, isCompleted?: boolean) => {
        const categoryFiltered = categoryFilter === ""
            ? todos
            : todos.filter(todo => todo.category === categoryFilter);

        return isCompleted !== undefined
            ? categoryFiltered.filter(todo => todo.completed === isCompleted)
            : categoryFiltered;
    };


    const handleToggleTodo = (id: string, title: string, completed: boolean) => {
        dispatch(toggleTodo(id));

        const status = !completed ? "marked as completed" : "removed form completed";
        const tagColor = !completed ? "green" : "orange";

        notification.success({
            message: "Todo status updated",
            description: <span><Tag className={"m-0! capitalize"} color={tagColor}>{title}</Tag> is {status}</span>,
        });
    }

    const handleStartEditing = (id: string, currentTitle: string, currentCategory: string = "") => {
        setEditedTitle(currentTitle);
        setIsEditing(true);
        setEditCategory(currentCategory)
        setEditingId(id);
    }

    const handleEditTodo = (id: string, title: string) => {
        if (title.trim() === "") {
            notification.info({message: "Todo title cannot be empty"});
            return;
        }
        dispatch(editTodo({id, title, category: editCategory}));
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
            render: (title, record) =>
                <Flex gap={10}>
                    <Checkbox
                        onClick={() => handleToggleTodo(record.id, record.title, record.completed)}
                        checked={record.completed}
                    />
                    {isEditing && editingId === record.id ?
                        <>
                            <Input
                                value={editedTitle}
                                onChange={(event) => setEditedTitle(event.target.value)}
                                onPressEnter={() => handleEditTodo(record.id, editedTitle)}
                            />
                            <Select defaultValue={record.category} onChange={(value) => setEditCategory(value)} className={"min-w-20"}>
                                {categories.map((category) => {
                                    return (
                                        <Select.Option
                                            key={category.id}
                                            value={category.label}
                                        >
                                            {category.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </>
                        :
                        <Typography.Text type={record.completed ? "secondary" : undefined}>{title} <Tag
                            className={"text-xs!"}>{record.category}</Tag> </Typography.Text>
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
                        <Button icon={<SaveOutlined/>} onClick={() => handleEditTodo(record.id, editedTitle)}/>
                        <Button icon={<CloseOutlined/>} onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                        }}/>
                    </Flex>
                    :
                    <Flex gap={10}>
                        <Button icon={<EditOutlined/>}
                                onClick={() => handleStartEditing(record.id, record.title, record.category)}/>
                        <Popconfirm
                            placement={"topLeft"}
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
        <Card className={"m-4! sm:w-lg bg-slate-100!"} variant={"outlined"}
              title={<Flex>TODO List Manager</Flex>}
        >
            <Input placeholder={"Enter todo title"} value={title}
                   onChange={(event) => setTitle(event.target.value)}
                   onPressEnter={handleAddTodo}
                   size={"large"}
            />
            <Space.Compact className={"mt-10! w-full!"}>
                <Select
                    allowClear
                    onChange={(value: string) => {
                        const selectedCategory = categories.find((category) => category.id === value);
                        setCategory(selectedCategory?.label || "");
                    }}
                    placeholder={"TODO category"}
                    size={"large"}
                    className={"w-full"}
                    options={categories}
                    fieldNames={{value: 'id'}}
                    optionRender={(option) => (
                        <>
                            <Flex justify={"space-between"} className={"w-full"}>
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
                <Button
                    onClick={handleAddTodo}
                    type="primary"
                    size={"large"}
                    icon={<PlusOutlined/>}
                >
                    Add todo
                </Button>
            </Space.Compact>
            <Flex className={"mt-10!"} wrap gap={5}>
                <Tag className={"cursor-pointer"}
                     color={`${selectedCategory === "" ? "blue" : ""}`}
                     onClick={() => setSelectedCategory("")}>All</Tag>
                {
                    categories.map((category) => (
                        <Tag className={"cursor-pointer"}
                             color={`${selectedCategory === category.label ? "blue" : ""}`}
                             onClick={() => setSelectedCategory(category.label)}>{category.label}</Tag>
                    ))
                }
            </Flex>

            <Flex className={"pt-10!"}>
                <Table
                    bordered
                    dataSource={filterTodos(selectedCategory, isCompleted)}
                    columns={columns}
                    className={"w-80 sm:w-full"}
                    scroll={{x: "max-content"}}
                    pagination={false}
                    title={() => <Flex>
                        <Tag
                            onClick={() => setIsCompleted(undefined)}
                            color={`${isCompleted === undefined ? "blue" : ""}`}
                        >
                            All
                        </Tag>
                        <Tag color={`${isCompleted === false ? "blue" : ""}`} onClick={() => setIsCompleted(false)}
                             className={`${isCompleted === false ? "text-black!" : "text-yellow-500!"}`}>Active</Tag>
                        <Tag
                            onClick={() => setIsCompleted(true)}
                            color={`${isCompleted === true ? "blue" : ""}`}
                            className={`${isCompleted === true ? "text-black!" : "text-green-500!"}`}
                        >
                            Completed
                        </Tag>
                    </Flex>}
                />
            </Flex>
        </Card>
    )
}