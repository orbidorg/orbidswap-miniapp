'use client'

import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiShield, FiLoader } from 'react-icons/fi'

interface WorldIDVerifyProps {
    action: string
    onSuccess?: (nullifierHash: string) => void
    onError?: (error: string) => void
}

export function WorldIDVerify({ action, onSuccess, onError }: WorldIDVerifyProps) {
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleVerify = async () => {
        if (!MiniKit.isInstalled()) {
            setError('Please open in World App')
            onError?.('Not in World App')
            return
        }

        setIsVerifying(true)
        setError(null)

        try {
            const verifyPayload: VerifyCommandInput = {
                action,
                verification_level: VerificationLevel.Orb,
            }

            const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

            if (finalPayload.status === 'error') {
                setError('Verification cancelled')
                onError?.('User cancelled verification')
                setIsVerifying(false)
                return
            }

            // Send proof to backend for verification
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload: finalPayload as ISuccessResult,
                    action,
                }),
            })

            const result = await response.json()

            if (result.success) {
                setIsVerified(true)
                const successPayload = finalPayload as ISuccessResult
                onSuccess?.(successPayload.nullifier_hash)
            } else {
                setError('Already verified or invalid proof')
                onError?.('Verification failed')
            }
        } catch (err) {
            setError('Verification failed')
            onError?.('Error during verification')
        }

        setIsVerifying(false)
    }

    if (isVerified) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-3 rounded-xl"
            >
                <FiCheck size={20} />
                <span className="font-medium">Verified Human</span>
            </motion.div>
        )
    }

    return (
        <div className="space-y-2">
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl"
            >
                {isVerifying ? (
                    <>
                        <FiLoader className="animate-spin" size={18} />
                        Verifying...
                    </>
                ) : (
                    <>
                        <FiShield size={18} />
                        Verify with World ID
                    </>
                )}
            </motion.button>
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
        </div>
    )
}

// Simple hook to use World ID status
export function useWorldIDStatus() {
    const [isVerified, setIsVerified] = useState(false)
    const [nullifierHash, setNullifierHash] = useState<string | null>(null)

    const verify = async (action: string) => {
        if (!MiniKit.isInstalled()) {
            return { success: false, error: 'Not in World App' }
        }

        try {
            const verifyPayload: VerifyCommandInput = {
                action,
                verification_level: VerificationLevel.Orb,
            }

            const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

            if (finalPayload.status === 'error') {
                return { success: false, error: 'Cancelled' }
            }

            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload: finalPayload as ISuccessResult,
                    action,
                }),
            })

            const result = await response.json()

            if (result.success) {
                const successPayload = finalPayload as ISuccessResult
                setIsVerified(true)
                setNullifierHash(successPayload.nullifier_hash)
                return { success: true, nullifierHash: successPayload.nullifier_hash }
            }

            return { success: false, error: 'Verification failed' }
        } catch (err) {
            return { success: false, error: 'Error' }
        }
    }

    return { isVerified, nullifierHash, verify }
}
