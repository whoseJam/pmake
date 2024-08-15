#include<iostream>
#include<cstring>
using namespace std;
const int N=1000005;
int nxt[N],n,m;
char A[N];

void Prepare(){
	nxt[1]=0;
	for(int i=2;i<=n;i++){
		int cur=nxt[i-1];
		while(cur&&A[cur+1]!=A[i])
			cur=nxt[cur];
		if(A[cur+1]==A[i])nxt[i]=cur+1;
		else nxt[i]=0;
	}
} 

int main(){
	scanf("%d%s",&n,A+1);
	Prepare();
	cout<<n-nxt[n]; 
	return 0;
}

