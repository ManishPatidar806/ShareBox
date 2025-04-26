"use client";
import React, { useState, useCallback, useRef } from 'react';
import { File, Lock, Unlock, KeyRound, ChevronDown, Upload } from 'lucide-react';
import MainLayout from '../../components/MainLayout';

// Use a dynamic import for crypto-js to handle browser context
const CryptoJS = () => import('crypto-js');

// Define available encryption methods
const encryptionMethods = [
    { value: 'AES', label: 'AES (Advanced Encryption Standard)' },
    { value: 'DES', label: 'DES (Data Encryption Standard)' },
    { value: 'TripleDES', label: 'Triple DES (3DES)' },
    { value: 'RC4', label: 'RC4 (Rivest Cipher 4)' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'RabbitLegacy', label: 'Rabbit (Legacy)' },
];

const FileEncryptorDecryptor = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('AES');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [operation, setOperation] = useState('encrypt');
    const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Drag and Drop Handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFile(droppedFiles[0]);
        }
    }, []);

    // Helper function to handle file processing
    const processFile = useCallback(async (op) => {
        if (!file) {
            setError('Please select a file.');
            return;
        }
        if (!password) {
            setError('Please enter a password.');
            return;
        }

        setError(null);
        setResult(null);

        try {
            const crypto = await CryptoJS();
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const fileContent = event.target?.result;
                    if (fileContent instanceof ArrayBuffer) {
                        const fileContentArray = new Uint8Array(fileContent);
                        let processedContent;

                        switch (selectedMethod) {
                            case 'AES':
                                processedContent = op === 'encrypt'
                                    ? crypto.AES.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.AES.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            case 'DES':
                                processedContent = op === 'encrypt'
                                    ? crypto.DES.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.DES.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            case 'TripleDES':
                                processedContent = op === 'encrypt'
                                    ? crypto.TripleDES.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.TripleDES.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            case 'RC4':
                                processedContent = op === 'encrypt'
                                    ? crypto.RC4.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.RC4.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            case 'Rabbit':
                                processedContent = op === 'encrypt'
                                    ? crypto.Rabbit.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.Rabbit.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            case 'RabbitLegacy':
                                processedContent = op === 'encrypt'
                                    ? crypto.RabbitLegacy.encrypt(crypto.lib.WordArray.create(fileContentArray), password).toString()
                                    : crypto.RabbitLegacy.decrypt(fileContentArray.toString(), password).toString(crypto.enc.Utf8);
                                break;
                            default:
                                throw new Error('Unsupported encryption method.');
                        }

                        setResult(processedContent);
                    } else {
                        setError('Failed to read file content.');
                    }
                } catch (e) {
                    console.error(e); // Log the error for debugging
                    setError(`Error during ${op}: ${e.message || 'An unexpected error occurred.'}`);
                }
            };

            reader.onerror = () => {
                setError('Failed to read file.');
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            setError(`Error: ${error.message || 'An unexpected error occurred.'}`);
        }
    }, [file, password, selectedMethod]);

    // Function to handle file download
    const handleDownload = () => {
        if (!result) {
            setError('Nothing to download. Please encrypt or decrypt a file first.');
            return;
        }

        setError(null);

        try {
            const blob = new Blob([result], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `processed_file.${operation === 'encrypt' ? 'enc' : 'dec'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(`Download error: ${e.message || 'An unexpected error occurred.'}`);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto p-4">
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                />

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        File {operation === 'encrypt' ? 'Encryption' : 'Decryption'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {operation === 'encrypt'
                            ? 'Secure your files with strong encryption'
                            : 'Unlock your encrypted files'}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Operation Toggle */}
                    <div className="flex justify-center space-x-4">
                        <button
                            className={`w-48 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center ${operation === 'encrypt'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-md'
                                }`}
                            onClick={() => setOperation('encrypt')}
                        >
                            <Lock className="mr-2 h-5 w-5" /> Encrypt
                        </button>
                        <button
                            className={`w-48 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center ${operation === 'decrypt'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-md'
                                }`}
                            onClick={() => setOperation('decrypt')}
                        >
                            <Unlock className="mr-2 h-5 w-5" /> Decrypt
                        </button>
                    </div>

                    {/* Drag and Drop File Input */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragOver
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                    >
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600">
                            {file
                                ? `Selected File: ${file.name}`
                                : 'Drag and drop a file here, or click to select'}
                        </p>
                        {file && (
                            <div className="mt-2 flex items-center justify-center">
                                <File className="mr-2 h-5 w-5 text-blue-600" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password-input"
                            type="password"
                            placeholder="Enter encryption password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Encryption Method Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Encryption Method
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            >
                                {encryptionMethods.find(m => m.value === selectedMethod)?.label}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                            {isMethodDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                    {encryptionMethods.map((method) => (
                                        <div
                                            key={method.value}
                                            onClick={() => {
                                                setSelectedMethod(method.value);
                                                setIsMethodDropdownOpen(false);
                                            }}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 hover:text-blue-700"
                                        >
                                            {method.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Process Button */}
                    <button
                        onClick={() => processFile(operation)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-semibold"
                    >
                        {operation === 'encrypt' ? (
                            <>
                                <Lock className="mr-2 h-5 w-5" /> Encrypt File
                            </>
                        ) : (
                            <>
                                <Unlock className="mr-2 h-5 w-5" /> Decrypt File
                            </>
                        )}
                    </button>

                    {/* Result Area */}
                    {result && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Content
                            </label>
                            <textarea
                                readOnly
                                value={result}
                                className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder={`Result of ${operation === 'encrypt' ? 'encryption' : 'decryption'} will appear here...`}
                            />
                        </div>
                    )}

                    {/* Download Button */}
                    {result && (
                        <button
                            onClick={handleDownload}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm font-semibold"
                        >
                            <KeyRound className="mr-2 h-5 w-5" />
                            Download {operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} File
                        </button>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
                            <strong className="font-semibold">Error: </strong>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default FileEncryptorDecryptor;
