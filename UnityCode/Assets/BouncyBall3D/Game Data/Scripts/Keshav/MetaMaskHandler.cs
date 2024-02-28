using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MetaMask;
using MetaMask.Unity;

public class MetaMaskHandler : MonoBehaviour
{
    private bool _connected = false;
    private bool _authorized = false;
    private System.Exception _exception = null;

    public void OnClick()
    {
        // MetaMaskUnity.Instance.Initialize();
        StartCoroutine(DoConnect());
    }

    void OnWalletConnected(object sender, System.EventArgs e)
    {
        Debug.Log("Demo: Wallet is connected");
        Debug.Log("Demo: SelectedAddress: " + MetaMaskUnity.Instance.Wallet.SelectedAddress);
        Debug.Log("Demo: SelectedChainId: " + MetaMaskUnity.Instance.Wallet.SelectedChainId);
        Debug.Log("Demo: ConnectedAddress: " + MetaMaskUnity.Instance.Wallet.ConnectedAddress);
        _connected = true;
    }

    void OnWalletAuthorized(object sender, System.EventArgs e)
    {
        Debug.Log("Demo: Wallet is authorized");
        Debug.Log("Demo: SelectedAddress: " + MetaMaskUnity.Instance.Wallet.SelectedAddress);
        Debug.Log("Demo: SelectedChainId: " + MetaMaskUnity.Instance.Wallet.SelectedChainId);
        Debug.Log("Demo: ConnectedAddress: " + MetaMaskUnity.Instance.Wallet.ConnectedAddress);
        _authorized = true;
    }

    public IEnumerator DoConnect()
    {
        _connected = false;
        _authorized = false;
        _exception = null;

        yield return new WaitForSeconds(0.5f);

        //MetamaskCanvas.SetActive(true);

        MetaMaskUnity.Instance.Events.WalletConnected += OnWalletConnected;
        MetaMaskUnity.Instance.Events.WalletAuthorized += OnWalletAuthorized;
        MetaMaskUnity.Instance.Events.EthereumRequestResultReceived += (o, e) =>
        {
            Debug.Log("Demo:EthereumRequestResultReceived");
            Debug.Log("Demo: result is: " + e.Result);
            _connected = true;
            _authorized = true;
            Debug.Log("Demo: SelectedAddress: " + MetaMaskUnity.Instance.Wallet.SelectedAddress);
            Debug.Log("Demo: SelectedChainId: " + MetaMaskUnity.Instance.Wallet.SelectedChainId);
            Debug.Log("Demo: ConnectedAddress: " + MetaMaskUnity.Instance.Wallet.ConnectedAddress);
        };
        MetaMaskUnity.Instance.Events.EthereumRequestFailed += (o, e) =>
        {
            Debug.Log("Demo:EthereumRequestFailed");
        };
        MetaMaskUnity.Instance.Events.WalletDisconnected += (o, e) =>
        {
            Debug.Log("Demo:WalletDisconnected");
        };
        MetaMaskUnity.Instance.Events.WalletPaused += (o, e) =>
        {
            Debug.Log("Demo:WalletPaused");
        };
        MetaMaskUnity.Instance.Events.StartConnecting += (o, e) =>
        {
            Debug.Log("Demo:StartConnecting");
        };
        MetaMaskUnity.Instance.Events.WalletUnauthorized += (o, e) =>
        {
            Debug.Log("Demo:WalletUnauthorized");
        };

        MetaMaskUnity.Instance.Events.WalletConnected -= OnWalletConnected;
        MetaMaskUnity.Instance.Events.WalletAuthorized -= OnWalletAuthorized;

        System.Threading.Tasks.Task<string> signature = MetaMaskUnity.Instance.ConnectAndSign("a message");

        Debug.Log("Demo: waiting");
        //yield return new WaitUntil(() => (_connected && _authorized) || _exception != null);
        // Debug.Log("Demo: waiting done");
        //Debug.Log("Demo: SelectedAddress: " + MetaMaskUnity.Instance.Wallet.SelectedAddress);
        //Debug.Log("Demo: SelectedChainId: " + MetaMaskUnity.Instance.Wallet.SelectedChainId);
        //Debug.Log("Demo: ConnectedAddress: " + MetaMaskUnity.Instance.Wallet.ConnectedAddress);
        //Debug.Log("Demo: PublicKey: " + MetaMaskUnity.Instance.Wallet.Session.PublicKey);

        //signature.
        //Debug.Log("Demo: signature: " + signature.Result);

        //OTPPanel.SetActive(false);

        //MetamaskCanvas.SetActive(false);

        if (_exception != null)
        {
            MetaMaskUnity.Instance.Disconnect(true);
            Debug.Log("Wallet EXCEPTION: " + _exception.ToString());
            //throw _exception;
        }
    }

}
