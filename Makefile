deploy:
	git add .
	git commit -m "add calendar"
	git push -u origin main

run:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	npm run clean