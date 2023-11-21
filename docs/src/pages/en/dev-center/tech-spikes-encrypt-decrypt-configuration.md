---
title: Encrypt and decrypt exported and imported files
description: Encrypt and decrypt exported and imported files
layout: ../../../layouts/MainLayout.astro
---

# Spike -- Encrypt & Decrypt configuration

## Background

Current user can export project configuation file from system. But there is many scurity data which is plain text in the file. It’s doesn’t unsafe.  The file should be encrypted and don’t allow user to update as well. It will be decrypted when import.

## Story

The encrypted config file will be download when user click save button in config project page. The project data will be decrypted after use inputted same password when import the encrypted config file. If the password is not correct, it will pop up error.

## Solutions

### 1. Solution detail
The solution is like below:

![img.png]()

![img.png]()

To prevent unauthorized users from attempting password cracking by continuously invoking the API, and due to the current absence of stored user information in our backend to identify whether it is the same user or to track error counts, it is necessary to implement rate limiting at the gateway.

Notes:
* HmacSHA256: Hash-based Message Authentication Code using the SHA-256 hash function.

* AES: Advanced Encryption Standard. AES is a symmetric encryption algorithm that is widely used to secure sensitive data.

* IV: Initialization Vector. The Initialization Vector is a crucial component in cryptographic algorithms, particularly in block ciphers like AES. The Initialization Vector is a random or unique value that is used along with the encryption key. Its primary purpose is to ensure that identical plaintexts do not produce the same ciphertext when encrypted multiple times. The IV adds an element of randomness to the encryption process, enhancing the security of the encryption.

* Question: Why does we store the dynamic iv in the encrypted file?  Should a fixed IV be used, and the encrypted file does not store the IV?

* Answer: Using a dynamic IV and storing it in the encrypted file is a more secure approach. A dynamic IV is randomly generated for each encryption, ensuring that the same data produces different ciphertexts each time. This enhances the security of the encryption, especially against specific attacks like known-plaintext attacks.      A fixed IV may introduce security risks, as encrypting the same data could result in identical ciphertexts, potentially leading to vulnerabilities such as stream cipher attacks.
Therefore, it is generally recommended to use a dynamic IV instead of a fixed IV. Storing the dynamic IV in the encrypted file is reasonable, as long as the integrity and security of the file are ensured.
