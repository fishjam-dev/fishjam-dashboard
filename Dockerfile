FROM node:19.5.0-alpine as builder 

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build


# Bundle static assets with nginx
FROM nginx:1.25-alpine as development
# Copy built assets from `builder` image
COPY --from=builder app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/default.conf
# Expose port
EXPOSE 3001
# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
