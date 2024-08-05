#include<bits/stdc++.h>
using namespace std;
const int N=5005;
int a[N],f[N],t[N];
int main(){
	int n,maxx=0;
	scanf("%d",&n);
	for(int i=1;i<=n;i++)
		scanf("%d",&a[i]);
	for(int i=1;i<=n;i++){
		f[i]=1;t[i]=1;
		for(int j=1;j<i;j++){
			if(a[i]>=a[j])continue;
			if(f[i]<f[j]+1){
				f[i]=f[j]+1;
				t[i]=t[j];
			}else if(f[i]==f[j]+1){
				t[i]+=t[j];
			}
		}
		for(int j=1;j<i;j++)
			if(f[i]==f[j]&&a[i]==a[j])
				t[j]=0;
		maxx=max(maxx,f[i]);
	}
	int sum=0;
	for(int i=1;i<=n;i++)
		if(f[i]==maxx)sum+=t[i];
	printf("%d %d",maxx,sum);
	return 0;
}
