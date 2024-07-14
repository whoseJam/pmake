#include<iostream>
#include<cstdio>
using namespace std;

const int N=1000005;
string a;
int nxt[N];

void getNext(){
	int cur=0;
	for(int i=2;i<=a.length()-1;i++){
		while(cur>0&&a[cur+1]!=a[i])cur=nxt[cur];
		if(a[cur+1]==a[i])cur++;
		nxt[i]=cur;
	}
}

char tmp[N];
int main(){
	int n;
	for(int c=1;;c++){
		scanf("%d",&n);
		if(n==0)break;
		scanf("%s",tmp);
		a=tmp;
		a=' '+a;
		
		getNext();
		printf("Test case #%d\n",c);
		for(int i=1;i<=a.length()-1;i++){
			if(i%(i-nxt[i])==0){
				int len=i/(i-nxt[i]);
				if(len>=2){
					printf("%d %d\n",i,len);
				}
			}
		}
		printf("\n");
	}
	return 0;
}
