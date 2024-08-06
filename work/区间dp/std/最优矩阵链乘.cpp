#include<algorithm>
#include<vector>
#include<queue>
#include<stack>
#include<map>

#include<string.h>
#include<stdlib.h>
#include<stdio.h>
#include<math.h>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int N=105;
int p[N],dp[N][N],n;
int main(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++)
		scanf("%d",&p[i]);
	for(int len=2;len<=n-1;len++){
		for(int l=1,r;l+len-1<=n-1;l++){
			r=l+len-1;
			dp[l][r]=inf;
			for(int k=l;k<r;k++){
				dp[l][r]=min(dp[l][r],dp[l][k]+dp[k+1][r]+p[l]*p[k+1]*p[r+1]);
			}
		}
	}
	printf("%d\n",dp[1][n-1]);
	return 0;
}
