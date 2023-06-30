using TMPro;
using UnityEngine;
using UnityEngine.UI;

//TODO: (MED) can be removed
/*
public class WalletUIController : MonoBehaviour
{
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
        ActiveAddressText.text = SuiWallet.GetActiveAddress();

        PlayButton.onClick.AddListener(() =>
        {
            Debug.Log("test11");
        });
    }
}
*/