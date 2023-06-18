using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class WalletUIController : MonoBehaviour
{
    //TODO: this will be a randomly generated message 
    private const string MESSAGE_TO_SIGN = "A MESSAGE TO SIGN"; 

    //call to request the front end Javascript code to sign a message 
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void CallSuiSignMessage(string msg);

    public Button NewWalletButton;
    public TMP_InputField NewWalletMnemonicsText;
    public Button PlayButton;

     public Button ImportWalletButton;
     public TMP_InputField MnemonicsInputField;

    public TMP_InputField ActiveAddressText;


    private void Start()
    {
        //TODO: when is this entire class used? ever? 
        ActiveAddressText.text = SuiWallet.GetActiveAddress();

        NewWalletButton.onClick.AddListener(() =>
        {
            CallSuiSignMessage(MESSAGE_TO_SIGN);
            /*
            var walletmnemo = SuiWallet.CreateNewWallet();
            NewWalletMnemonicsText.gameObject.SetActive(true);
            NewWalletMnemonicsText.text = walletmnemo;

            ActiveAddressText.text = SuiWallet.GetActiveAddress();
            */
        });


         ImportWalletButton.onClick.AddListener(() =>
         {
            CallSuiSignMessage(MESSAGE_TO_SIGN);
            /*
             NewWalletMnemonicsText.gameObject.SetActive(false);
             SuiWallet.RestoreWalletFromMnemonics(MnemonicsInputField.text);
             ActiveAddressText.text = SuiWallet.GetActiveAddress();
             Debug.Log("Address...>" + ActiveAddressText.text);
             */
         });

        PlayButton.onClick.AddListener(() =>
        {
            Debug.Log("test11");
        });
    }
}
