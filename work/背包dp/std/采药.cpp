#include <iostream>
using namespace std;

const int M=105;
const int T=1005;
int w[M],val[M],dp[T];

int main(){
    int t,m;    
    scanf("%d%d",&t,&m);
    for(int i=1;i<=m;i++){
        scanf("%d%d",&w[i],&val[i]);
    }
    for(int i=1;i<=m;i++){
        for(int j=t;j>=0;j--){
            if(j>=w[i]){
                dp[j]=max(dp[j-w[i]]+val[i],dp[j]);
            }
        }
    }
    printf("%d",dp[t]);
    return 0;
}
