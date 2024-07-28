#include<iostream>
#include<cmath>
#include<iomanip>
#include<algorithm>
#include<stdio.h>  
#include<string.h>
#include<math.h>
using namespace std;

const int N=10005;
int n,m,k,f[N],ans;
 
struct across{
	int x,y;
}c[N];
 
bool cmp(across a,across b){
	if(a.x==b.x)
		return a.y<b.y;
	return a.x<b.x;
}
 
int main(){
	cin>>n>>m>>k;
	for(int i=1;i<=k;i++)
		cin>>c[i].x>>c[i].y;
	sort(c+1,c+1+k,cmp);
	
	for(int i=1;i<=k;i++){
		f[i]=1;
		for(int j=1;j<i;j++){
			if(c[i].x>c[j].x&&c[i].y>c[j].y){
				f[i]=max(f[i],f[j]+1);
			}
		}
		ans=max(ans,f[i]);
	}
	printf("%.0lf\n",(n+m-(2-sqrt(2))*ans)*100);  
	return 0;
}
