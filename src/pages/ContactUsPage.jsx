import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { PrimeReactProvider } from 'primereact/api';

const API_BASE_URL = 'http://localhost:5000/api';

const ContactUsPage = () => {
    const { darkMode } = useTheme();
    const [message, setMessage] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Set PrimeReact theme
    useEffect(() => {
        const themeLink = document.getElementById('prime-theme');
        if (themeLink) {
            themeLink.href = darkMode 
                ? 'https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css'
                : 'https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css';
        }
    }, [darkMode]);

    useEffect(() => {
        const fetchPublicMessages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/messages/public`);
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };
        fetchPublicMessages();
    }, []);

    const sendMessage = async () => {
        if (!message.trim()) {
            setError('Please enter a message');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_BASE_URL}/contact_us_messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: message,
                    name: name.trim() || 'Anonymous',
                    email,
                    isPublic
                }),
            });
            const result = await response.json();
            const newMessage = result.data;

            if (isPublic) {
                setMessages([newMessage, ...messages]);
            }

            setMessage('');
            setName('');
            setEmail('');
            setSuccess(isPublic ? 'Message posted publicly!' : 'Private message sent!');
        } catch (err) {
            setError('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id, isLike) => {
        try {
            await fetch(`${API_BASE_URL}/messages/${id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isLike }),
            });

            setMessages(messages.map(msg => {
                if (msg.id === id) {
                    return {
                        ...msg,
                        likes: isLike ? msg.likes + 1 : msg.likes,
                        dislikes: !isLike ? msg.dislikes + 1 : msg.dislikes,
                        userVote: isLike ? 'like' : 'dislike'
                    };
                }
                return msg;
            }));
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Theme classes
    const containerClasses = classNames({
        'p-4 mx-auto min-h-screen max-w-6xl transition-colors duration-300': true,
        'bg-gray-900 text-gray-100': darkMode,
        'bg-gray-100 text-gray-900': !darkMode
    });

    const cardClasses = classNames({
        'mb-6 transition-colors duration-300': true,
        'bg-gray-800 border-gray-700': darkMode,
        'bg-white border-gray-200': !darkMode
    });

    const inputClasses = classNames({
        'w-full transition-colors duration-300': true,
        'bg-gray-700 border-gray-600 text-white placeholder-gray-400': darkMode,
        'bg-white border-gray-300 text-gray-900': !darkMode
    });

    const labelClasses = classNames({
        'block mb-2 transition-colors duration-300': true,
        'text-gray-300': darkMode,
        'text-gray-700': !darkMode
    });

    return (
        <PrimeReactProvider>
            <div className={containerClasses}>
                <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Contact Us
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Message form */}
                    <Card className={cardClasses}>
                        <div className="flex flex-col gap-4">
                            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Send us a message
                            </h2>

                            {error && <Message severity="error" text={error} />}
                            {success && <Message severity="success" text={success} />}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className={labelClasses}>Name (optional)</label>
                                    <InputText
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Email</label>
                                    <InputText
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className={labelClasses}>Message</label>
                                <InputTextarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    rows={5}
                                    autoResize
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <ToggleButton
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.value)}
                                    onLabel="Public"
                                    offLabel="Private"
                                    onIcon="pi pi-globe"
                                    offIcon="pi pi-lock"
                                    className="w-32"
                                />

                                <Button
                                    label={isPublic ? "Post Publicly" : "Send Privately"}
                                    icon="pi pi-send"
                                    loading={loading}
                                    onClick={sendMessage}
                                    className="ml-auto"
                                    severity="help"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Public messages */}
                    <div>
                        <Divider>
                            <span className={`text-lg font-medium px-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Public Messages ({messages.length})
                            </span>
                        </Divider>

                        <div className="grid gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                            {messages.length === 0 ? (
                                <Card className={cardClasses}>
                                    <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No public messages yet. Be the first to post!
                                    </p>
                                </Card>
                            ) : (
                                messages.map((msg) => (
                                    <Card key={msg.id} className={cardClasses}>
                                        <div className="flex gap-3">
                                            <Avatar
                                                label={msg.name.charAt(0)}
                                                className="bg-blue-500 text-white"
                                                shape="circle"
                                                size="large"
                                            />

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                        {msg.name}
                                                    </span>
                                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatDate(msg.createdAt)}
                                                    </span>
                                                    {msg.adminReply && (
                                                        <span className={classNames({
                                                            'text-xs px-2 py-1 rounded-full': true,
                                                            'bg-green-900 text-green-200': darkMode,
                                                            'bg-green-100 text-green-800': !darkMode
                                                        })}>
                                                            Admin Replied
                                                        </span>
                                                    )}
                                                </div>

                                                <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {msg.content}
                                                </p>

                                                {msg.adminReply && (
                                                    <div className={`pl-4 border-l-4 mb-3 ${
                                                        darkMode ? 'border-blue-600' : 'border-blue-500'
                                                    }`}>
                                                        <div className="flex items-center gap-2 text-sm mb-1">
                                                            <Avatar
                                                                icon="pi pi-user"
                                                                size="small"
                                                                shape="circle"
                                                                className={classNames({
                                                                    'text-blue-800': !darkMode,
                                                                    'text-blue-200': darkMode,
                                                                    'bg-blue-100': !darkMode,
                                                                    'bg-blue-900': darkMode
                                                                })}
                                                            />
                                                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                                Admin
                                                            </span>
                                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {formatDate(msg.adminReply.date)}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {msg.adminReply.content}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex gap-3">
                                                    <Button
                                                        icon={`pi pi-thumbs-up ${msg.userVote === 'like' ? 'text-blue-500' : ''}`}
                                                        label={msg.likes.toString()}
                                                        className="p-button-text"
                                                        onClick={() => handleVote(msg.id, true)}
                                                        tooltip="Like this message"
                                                        text
                                                    />

                                                    <Button
                                                        icon={`pi pi-thumbs-down ${msg.userVote === 'dislike' ? 'text-blue-500' : ''}`}
                                                        label={msg.dislikes.toString()}
                                                        className="p-button-text"
                                                        onClick={() => handleVote(msg.id, false)}
                                                        tooltip="Dislike this message"
                                                        text
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PrimeReactProvider>
    );
};

export default ContactUsPage;