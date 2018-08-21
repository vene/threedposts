import json
import math
import numpy as np


def compute_z(x, y):
    theta = np.array([x, y, 0])
    p = np.exp(theta) / np.sum(np.exp(theta))
    return p[1]


n = 111
m = 111

xs = np.linspace(-3, 3, n)
ys = np.linspace(-3, 3, m)


X, Y = np.meshgrid(xs, ys)
Z = np.empty_like(X)

for i in range(n):
    for j in range(m):
        x = X[i, j]
        y = Y[i, j]
        Z[i, j] = compute_z(x, y)

points = np.column_stack([X.ravel(), Y.ravel(), Z.ravel()])

# by default, this point cloud would be displayed with Z facing up.
# let's rotate it to make it prettier

def rotate3d_x(points, theta):
    c = math.cos(theta)
    s = np.sin(theta)

    R = np.array([[1, 0, 0],
                  [0, c, -s],
                  [0, s, c]])
    return np.dot(points, R)

def rotate3d_z(points, theta):
    c = math.cos(theta)
    s = np.sin(theta)

    R = np.array([[c, -s, 0],
                  [s, c, 0],
                  [0, 0, 1]])
    return np.dot(points, R)

points = rotate3d_z(points, np.pi / 4)
points = rotate3d_x(points, np.pi / 2.5)

data = {
    'x': points[:, 0].tolist(),
    'y': points[:, 1].tolist(),
    'z': points[:, 2].tolist()
}

template = f"""\
var n = {n};
var m = {m};
var data = {json.dumps(data)};
"""

with open('data.js', 'w')  as f:
    print(template, file=f)
