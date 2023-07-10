using UnityEngine;

//TODO: (LOW) is this used?
public class SavingHandler : Singleton<SavingHandler>
{
    public int bestScore = 0;

    //TODO: (HIGH) this must not load on Awake, or else it will get the last user's high score (if this is used at all)
    protected override void Awake()
    {
        base.Awake();
        LoadData();
    }

    public void LoadData()
    {
        bestScore = UserData.BestScore;
    }

    public void SaveData()
    {
        UserData.BestScore = bestScore;
    }
}
